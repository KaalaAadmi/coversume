- Connect Stripe
- Create logo
- Remove Commented Code
- ~~Make private routes for generator, profile, history, dashboard~~
- ~~Make cards use shadcn components in /generator page~~
- ~~Make contact form functional~~
- ~~Make blog dynamic~~
- ~~Add sentry~~
- ~~Add sentry `report a bug`~~
- ~~Fix img in testimonials to Image from next/image~~
- ~~Make testimonials be a marquee like in weebwear~~
- ~~Modify code to use App Router~~
- ~~Make FAQ Page accordian just like the one in homepage~~
- ~~Implement `react-hook-form` in register page~~
- ~~Implement `react-hook-form` in login page~~
- ~~Make the Login and Register page headers like in pricingg and FAQ page~~
- ~~Make dashboard page header like in pricing page~~
- ~~Make profile page header like in pricing page~~
- ~~Make profile page cards using shadcn card~~
- ~~Fix hostname issue for next/image in testimonials~~
- ~~Make testimonials card same sizes for all~~
- ~~Use `react-hook-form` in profile page~~
- ~~Make create blog posts page~~
- ~~Make blog data page~~
- ~~Make contact card using shadcn~~
- ~~Make contact card have react-hook-form~~
- ~~Make contact card with shadcn elements~~

PAGES:

- ~~Home~~
- ~~FAQ~~
- ~~Pricing~~
- ~~Login~~
- ~~Register~~
- ~~Dashboard~~
- ~~Generator~~
- ~~Profile~~
- ~~History~~
- ~~Privacy~~
- ~~Terms~~
- ~~Cookie Policy~~
- ~~Contact~~
- ~~About~~
- ~~Blog~~

BACKEND:

- ~~auth~~
  - ~~login~~
  - ~~register~~
  - ~~forgot password~~
  - ~~verify user~~

NOTE:

- email verification - mailjet
- reset password - mailtrap
- contact form - mailgun

For all the api references for better-auth in your project: http://localhost:3000/api/auth/reference

Generate Cover letter:

- Store:
  - Resume
  - job description
  - timestamp
  - generated cover letter
  - id
  -

GENERATOR:

- ~~Make markdown editable~~
- ~~Download resume~~
- ~~Refinement~~
  - ~~Frontend~~
  - ~~API~~
- ~~Save letter - happens automatically~~
- ~~versioning of cover letter~~
- ThumbsUp button should do something, if not remove it
- ThumbsDown button should do something if not remove it
- Copy and download button should also open up a modal asking the user: "Did you apply for the job?" if the user is a pro user.

- Update the monthlyCountLastReset in /subscribe endpoint that will be used for becoming pro member.

- ~~View page for the cover letter~~

- ~~Dashboard~~
  - ~~Frontend~~
  - ~~API~~

~~display the versions in history beside every row in generated cover letters~~

Application Tracker(Later):

- endpoint for application tracker.
- display application tracker most recent in dashboard
- add see more in dashboard for application tracker
- create page for application tracker

~~create page for history with full list of all the generated cover letters and versions~~

- ~~Add a create blog post page~~
- ~~Add a create blog post page route to add blogposts to db~~
- ~~fetch data from db for blog posts in blogs and blogs/[id]~~
  TODO:
- **Make the register button disabled if the tos are not accepted.**

- **Upon deleting a coverletter, the count for the month gets reduced, this should not happen.** --> Check and confirm, apparrently this is not happening.

- upgrade to pro button in dashboard needs to go to pricing page

  TEST:

Resume generator:

- use shadcn card component for the left column
- ~~portfolio doesn't show up in preview~~
- ~~summary is optional as it should be and doesn't show up in preview~~
- ~~resume details and `update preview` button should be fixed to top and be always visible in the left column~~
- ~~education should be before work in the left column as it is in the preview~~
- ~~labels in education entry~~
- ~~location doesn't show up in preview~~
- ~~dates should be in the format MMM YYYY, meaning, if the user enters the date as June 2020, it should display as Jun 2020~~
- ~~no grade field in left column~~
- ~~relavant course work doesn't show up in preview~~
- ~~if multiple education is added, then the order of the education in preview and the final file should be in descending order by the date~~
- ~~the delete buttons for every field is not is correct position~~
- ~~for key resp & achievements, there should be instruction to tell user to use new lines for next bullet point~~
- if a bullet point content length is more than what can be fit in a line, the formatting of the continuation is a bit haywire and starts from the begining of the line.
- ~~labels for work experience~~
- ~~if multiple experience is added, then the order of the experience in preview and the final file should be in descending order by the date~~
- ~~skills doesn't show up on preview~~
- ~~projects don't show up in preview~~
- ~~labels for project~~
- page break should be mentioned in preview to let the user know that the length of the content is longer than 1 page
- ~~Activities and leadership section is missing~~
- Add `Generate` button
- set values which are generated with ai and update preview
