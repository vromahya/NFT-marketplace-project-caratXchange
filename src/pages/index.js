import Home01 from './Home01';
// import Explore01 from './Explore01';
import ExplorePage from './ExplorePage';
import ItemDetails from './ItemDetails';
import Activity01 from './Activity01';
import Blog from './Blog';
import BlogDetails from './BlogDetails';

import Authors from './Authors';

import CreateItem from './CreateItem';
import EditProfile from './EditProfile';

import FAQ from './FAQ';
import Contact01 from './Contact01';

const routes = [
  { path: '/', component: <Home01 /> },
  { path: '/explore', component: <ExplorePage /> },
  { path: '/item-details/:tokenId', component: <ItemDetails /> },
  { path: '/activity', component: <Activity01 /> },
  { path: '/blog', component: <Blog /> },
  { path: '/blog-details', component: <BlogDetails /> },
  { path: '/authors/:address', component: <Authors /> },
  { path: '/create-item', component: <CreateItem /> },
  { path: '/edit-profile/:address', component: <EditProfile /> },
  { path: '/faq', component: <FAQ /> },
  { path: '/contact', component: <Contact01 /> },
];

export default routes;
