# The Graph API

## Graph API Overview

The Graph API is the primary way to get data out of, and put data into, Facebook's platform. It's a low-level HTTP-based API that you can use to programmatically query data, post new stories, manage ads, upload photos, and perform a variety of other tasks that an app might implement.


### The Basics

The Graph API is named after the idea of a 'social graph' - a representation of the information on Facebook composed of:

- **nodes** - basically "things" such as a User, a Photo, a Page, a Comment
- **edges** - the connections between those "things", such as a Page's Photos, or a Photo's Comments
- **fields** - info about those "things", such as a person's birthday, or the name of a Page


### How it's Structured

In general you can read APIs by making HTTP GET requests to nodes or edges on those nodes.

The Graph API is named after the idea of a 'social graph' - a representation of the information on Facebook composed of:

- **nodes** - basically "things" such as a User, a Photo, a Page, a Comment
- **edges** - the connections between those "things", such as a Page's Photos, or a Photo's Comments
- **fields** - info about those "things", such as a person's birthday, or the name of a Page

#### Object IDs

Each node has a unique ID which is used to access it via the Graph API. We specifically do not document any node/object ID structure or format because it is extremely likely to change over time and apps should not make assumptions based on current structure.

#### Load the Graph API Explorer

The easiest way to understand the Graph API is to use it with the Graph API Explorer, a low-level tool you can use to query, add and remove data. It's a very handy resource to have at your fingertips while you integrate with Facebook. So your next step is to go to the [Graph API Explorer](https://developers.facebook.com/tools/explorer).
