# Graph-api endpoints

## Publishing
Most nodes in the Graph API have edges that can be publishing targets, such as /{user-id}/feed or /{album-id}/photos. All Graph API publishing is done with an HTTP POST request to the relevant edge with any necessary parameters included. For example, to publish a post on behalf of someone, you would make an HTTP POST request as below:

``` 
POST graph.facebook.com
  /{user-id}/feed?
    message={message}&
    access_token={access-token}
    
```
All publishing calls must be signed with an access token. You can determine which permissions are needed in this access token by looking at the Graph API reference for the node to which you wish to publish.

There are a large number of edges that can be publishing targets. Details can be found in the reference doc for each node.

The Common Scenarios for Graph API guide contains additional information for a few common publishing scenarios.



### Updating
All Graph API updating is done with an HTTP POST request to the relevant node with any updated parameters included:

``` 
POST graph.facebook.com
  /{node-id}?
    {updated-field}={new-value}&
    access_token={access-token} 
```

All update calls must be signed with an access token with the same permissions needed for publishing to that endpoint, as per the Graph API reference for the node that you wish to update.


### Deleting
Delete nodes from the graph by sending HTTP DELETE requests to them:

``` 
DELETE graph.facebook.com
  /{node-id}?
    access_token=... 
```

Generally speaking, an app can only delete content it created. Check the reference guide for the node or edge for more information.

To support clients that do not support all HTTP methods, you can alternatively issue a POST request to an endpoint with the additional argument method=delete to override the HTTP method. For example, you can delete a comment by issuing the following request:

```
POST graph.facebook.com
  /{comment-id}?
    method=delete 
```

### Read-After-Write
For create and update endpoints, the Graph API can immediately read a successfully published or updated object and return any fields supported by the corresponding read endpoint.

To use this feature, include a fields parameter in your request and list the fields you want returned. For example, to publish the message “Hello” to a user's feed, you could make the following request:

``` 
  POST graph.facebook.com
  /126577551217199/feed?
    message=Hello&
    fields=created_time,from,id,message,permalink_url
```

This would return the specified fields as a JSON-formatted response, like this:

``` 
{
  "created_time": "2017-04-06T22:04:21+0000",
  "from": {
    "name": "Jay P Jeanne",
    "id": "126577551217199"
  },
  "id": "126577551217199_122842541590700",
  "message": "Hello",
  "permalink_url": "https://www.facebook.com/126577551217199/posts/122842541590700",
} 
```
Refer to each endpoint's reference documentation to see if it supports read-after-write and what fields are available.

