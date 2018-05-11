RESTFUL ROUTES:

name        url                 verb       description
================================================================================
INDEX     /campgrounds           GET      Display a list of all campgrounds
NEW       /campgrounds/new       GET      Displays form to make new campground
CREATE    /campgrounds           POST     Add new campground to DB
SHOW      /campgrounds/:id       GET      Shows info about one campground
EDIT      /campgrounds/:id/edit  GET      Displays edit form for one campground
UPDATE    /campgrounds/:id       PUT      Update a campground, then redirect
DESTROY   /campgrounds/:id      DELETE    Delete a campground, then redirect

REST - a mapping between HTTP routes and CRUD
