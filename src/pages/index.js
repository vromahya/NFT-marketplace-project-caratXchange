import Home01 from './Home01';
// import Explore01 from './Explore01';
import Explore04 from './Explore04';
import ItemDetails02 from './ItemDetails02';
import Activity01 from './Activity01';
import Blog from './Blog';
import BlogDetails from './BlogDetails';
import HelpCenter from './HelpCenter';
import Authors01 from './Authors01';
import Authors02 from './Authors02';
import WalletConnect from './WalletConnect';
import CreateItem from './CreateItem';
import EditProfile from './EditProfile';
import Ranking from './Ranking';
import Login from './Login';
import SignUp from './SignUp';
import NoResult from './NoResult';
import FAQ from './FAQ';
import Contact01 from './Contact01';

const routes = [
  { path: '/', component: <Home01 /> },
  { path: '/explore', component: <Explore04 /> },
  { path: '/item-details-02/:tokenId', component: <ItemDetails02 /> },
  { path: '/activity', component: <Activity01 /> },
  { path: '/blog', component: <Blog /> },
  { path: '/blog-details', component: <BlogDetails /> },
  { path: '/help-center', component: <HelpCenter /> },
  { path: '/authors/:id', component: <Authors01 /> },
  { path: '/authors-02', component: <Authors02 /> },
  { path: '/wallet-connect', component: <WalletConnect /> },
  { path: '/create-item', component: <CreateItem /> },
  { path: '/edit-profile', component: <EditProfile /> },
  { path: '/ranking', component: <Ranking /> },
  { path: '/login', component: <Login /> },
  { path: '/sign-up', component: <SignUp /> },
  { path: '/no-result', component: <NoResult /> },
  { path: '/faq', component: <FAQ /> },
  { path: '/contact', component: <Contact01 /> },
];

export default routes;
