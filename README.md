# Filter & Query

## Query Features

This endpoint supports various query parameters for filtering, sorting, pagination, and global search.

### Query Parameters

| Parameter        | Description                                                                              | Example                                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| filter           | Flexible filter, supports operators and relations. Format: `filter=field,operator,value` | `filter=username,=,john`<br>`filter=profile.name,like,John`<br>`filter=createdAt,between,2024-01-01\|2024-12-31` |
| limit            | Number of items per page                                                                 | `limit=10`                                                                                                       |
| page             | Page number                                                                              | `page=2`                                                                                                         |
| sort             | Column name for sorting (can be relation)                                                | `sort=username`<br>`sort=profile.name`                                                                           |
| order            | Sort direction (`asc` or `desc`)                                                         | `order=desc`                                                                                                     |
| search           | Global search in fields defined in backend (`concatFields`)                              | `search=john`                                                                                                    |
| [field]          | Direct filter by column                                                                  | `username=john`<br>`email=abc@xyz.com`                                                                           |
| [relation.field] | Direct filter in relation (if relation is included)                                      | `profile.name=John`                                                                                              |

### Supported Operators in `filter`

- `=` : equal
- `!=` : not equal
- `>` : greater than
- `>=` : greater than or equal
- `<` : less than
- `<=` : less than or equal
- `like` : contains
- `notLike` : does not contain
- `in` : one of (separate values with `|`)
- `notIn` : not one of
- `between` : between two values (separate with `|`)
- `notBetween` : outside two values
- `is`, `not`, `regexp`, `notRegexp`, `iRegexp`, `notIRegexp`

### Usage Examples

#### Column Filter

```
GET /api/user?username=john&email=abc@xyz.com
```

#### Relation Filter

```
GET /api/user?filter=profile.name,=,John
```

#### Range Filter

```
GET /api/user?filter=createdAt,between,2024-01-01|2024-12-31
```

#### Sort and Order

```
GET /api/user?sort=username&order=desc
```

#### Pagination

```
GET /api/user?limit=5&page=2
```

#### Global Search

```
GET /api/user?search=john
```

### Notes

- For relation filters, make sure the relation is included in the controller.
- For global search, the fields to be searched are defined in the backend (`concatFields`).
- All parameters can be combined as needed.

---

**This documentation helps you use the filter, sort, pagination, and search features in your API.**
