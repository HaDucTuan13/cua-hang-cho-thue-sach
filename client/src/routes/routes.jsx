import App from '../App';
import CartUser from '../Page/CartUser';
import DetailProduct from '../Page/DetailProduct';
import LoginUser from '../Page/Login';
import Register from '../Page/Register';
import Checkout from '../Page/Checkout';
import InfoUser from '../Page/infoUser';
import Dashboard from '../Page/Admin/Index';
import PaymentsSuccess from '../Page/PaymentsSuccess';
import ForgotPassword from '../Page/ForgotPassword';
export const routes = [
    { path: '/', component: <App /> },
    {
        path: '/login',
        component: <LoginUser />,
    },
    {
        path: '/register',
        component: <Register />,
    },
    {
        path: '/product/:id',
        component: <DetailProduct />,
    },
    {
        path: '/cart',
        component: <CartUser />,
    },
    {
        path: '/checkout',
        component: <Checkout />,
    },
    {
        path: '/info-user',
        component: <InfoUser />,
    },
    {
        path: '/admin',
        component: <Dashboard />,
    },
    {
        path: '/payments/:id',
        component: <PaymentsSuccess />,
    },
    {
        path: '/forgot-password',
        component: <ForgotPassword />,
    },
];
