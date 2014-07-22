# iStrategyLabs Skeleton Project

Use this as a template for new projects. Don't commit
project-specific code back to this repository. You should fork or make a new
repository for your project.

Settings are found in `/shared-settings.json`. `/shared-settings.json` is utilized by deployment code and must be valid json.

TIP: Trailing slashes matter in redirect / callback uris. Be sure they match.

### Shared Settings

Be sure you have sensible values in `/shared-settings.json`. Pay careful attention to the port numbers as you want to make sure your choice does not conflict with another application in the environment you're deploying to. Also remember that `development` and `staging` share the same servers so your port choice will need to be different there. The fabfile provides a sub method to determine the first available port. If you are deploying to a secure environment (using ssl), you will need to add the "server-name" of the secure web address, changed the dataURL to the secure web address with port 443 specified, change dataIsSecure to true, and add the domain for the ssl certificate to sslDomain.

## Front End development strategy

The client portion of the project allows for the creation of multiple clients for a single backend service (For example: desktop, mobile, etc.) This allows us to decouple dependencies per product, and thus gives us greater flexibility.

Skel-ISL comes with one barebones example of what a Front End client might look like. It uses Angular JS for its view management, bower for Front End dependency management and Grunt for common task management during development and deployment. For more details on this [read this](client/desktop/README.md).

### Static S3 Compilation

If you want a project that lives entirely on s3, you will need to fill in the s3BucketName that you would like to use in shared-settings.json. Also, your assetsDomain needs to point to your s3 bucket (s3.amazonaws.com/bucketname). A bootstrap will set everything up and get your project on s3 with a url bucketname.s3-website-us-east-1.amazonaws.com. All work should be done in the frontend for these projects (virtual:f, development:f, etc.). To update the project, a simple rsync/pull sub_run_grunt sub_upload_dists will update s3 with your latest code. If you want a client directory other than desktop to be uploaded to s3, bootstrap, sub_make_s3_buckets, and sub_upload_dists all take an optional parameter that defines the client directory to sync (defaulting to desktop).

### Gruntfiles structure

Our projects must all have, at a minimum, a single Gruntfile in its root. One is already provided here. We strongly encourage you to not alter this root Gruntfile, with one big exeption. The root Gruntfile is designed to be the entry point for more specific client or server tasks. It is assumed that upon deployment the default task of this root file will be called. Thus, if you wish to add more tasks, you should do so by creating another Gruntfile in the appropriate client/* folder, then adding a call in the root.

For example, in skel-grandstand's root Gruntfile you will find the following:

  `runGrunt.call(this, 'client/desktop', 'NODE_ENV='+environment+' build');`

This will call the task build in the client/desktop folder and pass along a variable that specifies the deployment environment.

Since we have organized files to have per-product npm package dependencies, we need to run `npm install` in each and every folder that we plan on running grunt in. In this repository, that is simply `client/desktop`, but it could extend to more types of clients, or even the backend if needed. This should be called by the fabfile as needed.

### Anatomy of the client/desktop Gruntfile

This is a starter Gruntfile for a basic angular Grandstand app. It has a number of tasks predefined that will likely suit most needs. Explanation of general setup and conventions follows.

#### Task - pre

Runs a git command to get the head revision SHA1 hash. This hash will be used to name files for cache-busting purposes.

#### Task - clean:pre

Deletes the `dist` and `src/lib` folders. Plain and simple

#### Task - bower

Installs Front End dependencies described in `bower.json`. Dependencies can easily be added to `bower.json` by running bower with the `--save` flag. For example

`bower install jquery --save`

#### Task - assemble

Creates the `index.html`, including environment-specific variables such as the version number (for cache busting), dataURL (defined in sharedSettings. For connecting to socket.io), dataIsSecure (defined in sharedSettings. For socket.io), environment (for client side, environment-specific things, such as logging... more on that later)

#### Task - compass

Runs compass. Puts the result in a tmp folder, so we can rename it later to add a version number.

#### Task - copy

Copies static content: images, fonts, html files, css (from the tmp folder described above)

#### Task - browserify

Runs a plugin for script dependency that does many things for us:

##### In-order script concatenation in the style of CJS (CommonJS) requirements.

All Front End developers are familiar with the crux of having to add `<script>` tags for every file you add to your project. This has a couple of downsides that we try to avoid. First, it puts the task of having to maintain a list of scripts, _in order_, in a html file, rather than with the code that uses it. It's an arbitrary limitation that we're only used to because browsers have always worked like that. Second, for every script we add to the `index.html`, the browser will spin up a separate http request in order to get it. We can do better than that.

Our Gruntfile is designed to look in a single point of entry: `src/scripts/app.js`. This file includes `require()` statements for every script it needs. Browserify parses this (and all required files, too) and concatenates them intelligently into a single output file. We then even minify it :)

This allows us to specify script dependency in the very same scripts where we would use them, preventing pollution in our Gruntfile, or over-complicated logic in our Gruntfiles to accomodate various script structures or even worse, having to maintain a separate manifest file.

#### Task - watch

When a SASS/CSS or JavaScript or HTML file is changed. It is compiled and copied over to dist. If you have livereload enabled in sharedSettings, the browser will refresh itself.

##### Just-in-time function calling

Script concatenation is great and all, but wouldn't it be better if we could also avoid having to run code until we actually needed it? Luckily, browserify gives us exactly that. All scripts are wrapped special functions, which are only called when the appropriate `require()` is called. That means that you can call `require()` _exactly_ where you want it to be, and you'll know that the required script will only be executed then, and only then.

#### Task - concat:css

Simple task: Grabs all css files in our bower deps, concatenates them, and puts them in our `dist/` folder. Yup, bower can be used for css dependencies too. For example, we use normalize-css for css resetting.

#### Task clean:post

Finally, delete the .tmp folder (where compass put its junk.)

### Local front end development flow
For developing locally in a non-vm environment, [read this](client/desktop/README.md)

## Files that need to be changed

The following is a list of the files that need to be edited to use your project name instead of `skel-isl` or `skelISLApp`:

- `/shared-settings.json`
- `/client/desktop/bower.json`
- `/client/desktop/package.json`
- `/client/desktop/src/index.hbs`
- `/client/desktop/src/js/*`

## The End