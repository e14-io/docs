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


