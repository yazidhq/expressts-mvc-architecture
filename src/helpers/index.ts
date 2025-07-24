import { FindOptions, Includeable, Op } from "sequelize";

interface FilterOptions {
  model: any;
  query: any;
  include?: Includeable[];
  defaultLimit?: number;
  concatFields?: string[];
}

export default class Helper {
  public static async getFiltered({ model, query, include = [], defaultLimit = 10, concatFields = [] }: FilterOptions) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || defaultLimit;
    const offset = (page - 1) * limit;

    function setNestedWhere(includeArr: any[], pathArr: string[], filterObj: any) {
      if (!pathArr.length) return;
      const rel = pathArr[0];
      let found = includeArr.find((inc) => inc.as === rel || inc.model?.name === rel);
      if (!found) {
        found = { association: rel, where: {} };
        includeArr.push(found);
      }
      if (pathArr.length === 1) {
        found.where = { ...found.where, ...filterObj };
      } else {
        if (!found.include) found.include = [];
        setNestedWhere(found.include, pathArr.slice(1), filterObj);
      }
    }

    const where: Record<string | symbol, any> = {};
    let includeNested = [...include];

    if (query.filter) {
      const filters = Array.isArray(query.filter) ? query.filter : [query.filter];
      filters.forEach((filterStr: string) => {
        const [field, operator, value] = filterStr.split(",");
        if (field && operator && value !== undefined) {
          const opMap: any = {
            "=": Op.eq,
            "!=": Op.ne,
            ">": Op.gt,
            ">=": Op.gte,
            "<": Op.lt,
            "<=": Op.lte,
            like: Op.like,
            notLike: Op.notLike,
            in: Op.in,
            notIn: Op.notIn,
            between: Op.between,
            notBetween: Op.notBetween,
            is: Op.is,
            not: Op.not,
            regexp: Op.regexp,
            notRegexp: Op.notRegexp,
            iRegexp: Op.iRegexp,
            notIRegexp: Op.notIRegexp,
          };

          const filterObj: { [key: string]: any } = {};
          if (["like", "notLike"].includes(operator)) {
            filterObj[field.split(".").pop()!] = { [opMap[operator]]: `%${value}%` };
          } else if (["in", "notIn", "between", "notBetween"].includes(operator)) {
            filterObj[field.split(".").pop()!] = { [opMap[operator]]: value.split("|") };
          } else {
            filterObj[field.split(".").pop()!] = { [opMap[operator] || Op.eq]: value };
          }

          if (field.includes(".")) {
            const pathArr = field.split(".");
            setNestedWhere(includeNested, pathArr.slice(0, -1), filterObj);
          } else {
            where[field] = filterObj[field];
          }
        }
      });
    }

    Object.keys(query).forEach((key) => {
      if (["page", "limit", "sort", "order", "search", "filter"].includes(key)) return;
      if (key.includes(".")) {
        const pathArr = key.split(".");
        const filterObj: any = {};
        filterObj[pathArr[pathArr.length - 1]] = query[key];
        setNestedWhere(includeNested, pathArr.slice(0, -1), filterObj);
      } else {
        where[key] = query[key];
      }
    });

    if (query.search && concatFields.length > 0) {
      where[Op.or] = concatFields.map((field) => ({
        [field]: { [Op.like]: `%${query.search}%` },
      }));
    }

    let order: any = [];
    if (query.sort) {
      order.push([query.sort, query.order && query.order.toUpperCase() === "DESC" ? "DESC" : "ASC"]);
    }

    const options: FindOptions = {
      where,
      include: includeNested,
      limit,
      offset,
      order,
    };

    const { rows, count } = await model.findAndCountAll(options);

    return {
      data: rows,
      count: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }
}
