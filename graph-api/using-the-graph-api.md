# Using the Graph API

## Reading

All nodes and edges in the Graph API can be read simply with an HTTP GET request to the relevant endpoint.
Most API calls must be signed with an access token.

### Choosing Fields

```
GET graph.facebook.com/me?fields=id,name,picture
```


### Ordering Fields

```
GET graph.facebook.com
  /{photo-id}?
    fields=comments.order(reverse_chronological)
```

order must be one of the following values:

chronological
reverse_chronological

### Making Nested Requests

The field expansion feature of the Graph API allows you to effectively nest multiple graph queries into a single call. Certain resources, including most of Ads API, are unable to utilize field expansion on some or all connections.

```
GET graph.facebook.com
  /{node-id}?
    fields=<first-level>{<second-level>}
```
<first-level> in this case would be one or more (comma-separated) fields or edges from the parent node. <second-level> would be one or more (comma-separated) fields or edges from the first-level node.


We can then extend this a bit more and for each album object, also retrieve the first two photos, and people tagged in each photo:


```
GET graph.facebook.com
  /me?
    fields=albums.limit(5){name, photos.limit(2)},posts.limit(5)
```


### Traversing Paged Results
When you make an API request to a node or edge, you usually don't receive all of the results of that request in a single response. This is because some responses could contain thousands of objects so most responses are paginated by default.

#### Cursor-based Pagination
Cursor-based pagination is the most efficient method of paging and should always be used where possible. A cursor refers to a random string of characters which marks a specific item in a list of data. Unless this item is deleted, the cursor will always point to the same part of the list, but will be invalidated if an item is removed. Therefore, your app shouldn't store cursors and assume that they will be valid in the future.

When reading an edge that supports cursor pagination, you will see the following JSON response:

```
{
  "data": [
     ... Endpoint data is here
  ],
  "paging": {
    "cursors": {
      "after": "MTAxNTExOTQ1MjAwNzI5NDE=",
      "before": "NDMyNzQyODI3OTQw"
    },
    "previous": "https://graph.facebook.com/me/albums?limit=25&before=NDMyNzQyODI3OTQw"
    "next": "https://graph.facebook.com/me/albums?limit=25&after=MTAxNTExOTQ1MjAwNzI5NDE="
  }
}
```

##### A cursor-paginated edge supports the following parameters:

- **before** : This is the cursor that points to the start of the page of data that has been returned.
- **after** : This is the cursor that points to the end of the page of data that has been returned.
- **limit** : This is the maximum number of objects that may be returned. A query may return fewer than the limit value due to filtering. Do not depend on the number of results being fewer than the limit value to indicate your query reached the end of the list of data, use the absence of next instead as described below. For example, if you set limit to 20, 20 objects will be found but, due to privacy filtering, only 9 are shown. If you reset limit to 40, 40 objects will be found but, again due to filtering, only 12 are returned. If there is no result in your search, there will be no pagination and no indication that more items are available, though there can be more items if you increase limit. Some edges may also have a maximum on the limit value for performance reasons.
- **next** : The Graph API endpoint that will return the next page of data. If not included, this is the last page of data. Due to how pagination works with visibility and privacy, it is possible that a page may be empty but contain a 'next' paging link. Stop paging when the 'next' link no longer appears.
- **previous** : The Graph API endpoint that will return the previous page of data. If not included, this is the first page of data.

> Don't store cursors. Cursors can quickly become invalid if items are added or deleted.

#### Time-based Pagination

Time pagination is used to navigate through results data using Unix timestamps which point to specific times in a list of data.

When using an endpoint that uses time-based pagination, you will see the following JSON response:

```
{
  "data": [
     ... Endpoint data is here
  ],
  "paging": {
    "previous": "https://graph.facebook.com/me/feed?limit=25&since=1364849754",
    "next": "https://graph.facebook.com/me/feed?limit=25&until=1364587774"
  }
}
```

A time-paginated edge supports the following parameters:

- **until** : A Unix timestamp or strtotime data value that points to the end of the range of time-based data.
- **since** : A Unix timestamp or strtotime data value that points to the start of the range of time-based data.
- **limit** : This is the maximum number of objects that may be returned. A query may return fewer than the value of limit due to filtering. Do not depend on the number of results being fewer than the limit value to indicate your query reached the end of the list of data, use the absence of next instead as described below. For example, if you set limit to 10 and 9 results are returned, there may be more data available, but one item was removed due to privacy filtering. Some edges may also have a maximum on the limit value for performance reasons. In all cases, the API returns the correct pagination links.
- **next** : The Graph API endpoint that will return the next page of data.
- **previous** : The Graph API endpoint that will return the previous page of data.

> For consistent results, specify both since and until parameters. Also, it is recommended that the time difference is a maximum of 6 months.


#### Offset-based Pagination

Offset pagination can be used when you do not care about chronology and just want a specific number of objects returned. This should only be used if the edge does not support cursor or time-based pagination.

An offset-paginated edge supports the following parameters:

- **offset** : This offsets the start of each page by the number specified.
- **limit** : This is the maximum number of objects that may be returned. A query may return fewer than the value of limit due to filtering. Do not depend on the number of results being fewer than the limit value to indicate your query reached the end of the list of data, use the absence of next instead as described below. For example, if you set limit to 10 and 9 results are returned, there may be more data available, but one item was removed due to privacy filtering. Some edges may also have a maximum on the limit value for performance reasons. In all cases, the API returns the correct pagination links.
- **next** : The Graph API endpoint that will return the next page of data. If not included, this is the last page of data. Due to how pagination works with visibility and privacy, it is possible that a page may be empty but contain a 'next' paging link. Stop paging when the 'next' link no longer appears.
- **previous** : The Graph API endpoint that will return the previous page of data. If not included, this is the first page of data.

> Offset based pagination is not supported for all API calls. To get consistent results, we recommend you to paginate using the previous/next links we return in the response.

### Making Multiple Request

The standard version of the Graph API is designed to make it easy to get data for an individual object and to browse connections between objects. It also includes a limited ability to retrieve data for a few objects at the same time.

If your app needs the ability to access significant amounts of data at once, or you need to make changes to several objects at once, it is often more efficient to batch your queries rather than make multiple individual HTTP requests.

#### Multiple ID Read Requests

You can make a single GET request that retrieves multiple nodes by using the ?ids endpoint with the object IDs of those nodes. For example, to lookup the Facebook Developers page and the current session user in a single request, you could use the following Graph API call:

```
GET graph.facebook.com
  /?ids=platform,me 
  ```

  Which is equivalent to the following individual API requests:

```
GET graph.facebook.com
  /platform
  
GET graph.facebook.com
  /me
```

The returned data will look something like this:

```
{
  "me": {
    "id": "1234567890"
    ... // Other fields
  }, 
  "platform": {
    "id": "19292868552"
    ... // Other fields
  }
}
```

This can also work with edges as long as all the requested IDs have the requested edge. For example:

```
GET graph.facebook.com
  /photos?ids={user-id-a},{user-id-b}
  ```

Is equivalent to the following individual API requests:


```
GET graph.facebook.com
  /{user-id-a}/photos
  
GET graph.facebook.com
  /{user-id-b}/photos
  ```

The returned data will look something like this:

```
{
  "{user-id-a}": {
    "data": [
      {
        "id": "12345", 
        "picture": "{photo-url}", 
        "created_time": "2014-07-15T15:11:25+0000"
      }
      ... // More photos
    ]
  },
  "{user-id-b}": {
    "data": [
      {
        "id": "56789", 
        "picture": "{photo-url}", 
        "created_time": "2014-01-15T12:24:47+0000"
      }
      ... // More photos
    ]
  }, 
}
```


## Introspection

The Graph API supports introspection of nodes. This enables you to see all of the edges a node has without knowing its type ahead of time. To get this information, add metadata=1 to the Graph API request:

``` 
GET graph.facebook.com
  /{node-id}?
    metadata=1
```
**The resulting JSON will include a metadata property that lists all the supported edges for the given node: 
**
```
{
   "name": {node-name},
   "metadata": {
      "connections": {
         "feed": "http://graph.facebook.com/me/feed",
         "picture": "https://graph.facebook.com/me/picture",
         ....
      }
      "fields": [
        {
          "name": "id",
          "description": "The user's Facebook ID. No `access_token` required. `string`."
        },
        ....
      ],
      "type": "user"
   }
}
```