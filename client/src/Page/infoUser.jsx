import { useState } from 'react';
import Footer from '../Components/Footer/Footer';
import Header from '../Components/Header/Header';
import { AccountInfo, OrderManagement, ViewedProducts, Sidebar, MyReviews } from './InfoUserComponents';
import { useParams } from 'react-router-dom';

function InfoUser() {
    const [activeComponent, setActiveComponent] = useState('account');

    // Handle logout action
    const handleLogout = () => {
        console.log('Logging out...');
        // Implement actual logout functionality here
    };

    // Handle menu selection
    const handleMenuSelect = (key) => {
        if (key === 'logout') {
            handleLogout();
            return;
        }
        setActiveComponent(key);
    };

    const params = useParams();
    console.log(params);

    // Render the active component based on selection
    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'account':
                return <AccountInfo />;
            case 'orders':
                return <OrderManagement />;
            case 'viewed':
                return <ViewedProducts />;
            case 'reviews':
                return <MyReviews />;
            default:
                return <AccountInfo />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <header>
                <Header />
            </header>

            <main className="flex-grow container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Trang cá nhân</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1 ">
                        <Sidebar onMenuSelect={handleMenuSelect} />
                    </div>

                    <div className="md:col-span-3">{renderActiveComponent()}</div>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default InfoUser;
