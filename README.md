# vue-easy-deploy
### The easiest way to deploy Vue CLI applications to GitHub Pages.
NPM package: [npmjs.com/package/vue-easy-deploy](https://www.npmjs.com/package/vue-easy-deploy)

#### First time users:
1.  `npm i -g vue-easy-deploy`<br /><br />
2.  `cd /path/to/your/git/repo`<br /><br />
3. `vue-easy-deploy` or `ved` to build your project<br /><br />
4. `git add .` &rarr; `git commit -m "Your message"` &rarr; `git push origin main`<br /><br />
5. Go to your GitHub repository &rarr; Settings &rarr; Pages<br /><br />
6. Set "source" to "main" and set "folder" to "docs"<br /><br />

That's it! After you've followed these steps your first time, you will only need to run `vue-easy-deploy` or `ved` before pushing your changes in order to update your website.

#### Motivation:

By default, Vue.js applications that were created using the Vue CLI can't be hosted statically. After you compile your hard work and try to open the resulting index.html file with your favorite web browser, you will be faced with an empty white screen. Many Vue.js users have experienced this frustration. Yes, there are existing ways of deploying your Vue CLI application, such as [this method](https://cli.vuejs.org/guide/deployment.html) described by the official Vue.js website. However, these methods are unnecessarily complicated for someone who's only trying to deploy a simple, non-enterprise project.

vue-easy-deploy is an NPM package that makes deploying Vue CLI projects as easy as possible.

*For anyone struggling to find the GitHub Pages settings for your repository:*<br />
github.com/\<GITHUB USERNAME\>/\<REPO NAME\>/settings/pages
