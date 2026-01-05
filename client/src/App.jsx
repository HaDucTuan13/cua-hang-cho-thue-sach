import './App.css';
import Header from './Components/Header/Header';
import HomePage from './Components/HomePage/HomePage';
import Footer from './Components/Footer/Footer';
import Banner from './Components/Banner/Banner';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function App() {
    return (
        <div className="w-full">
            <header>
                <Header />
            </header>

            <main className="w-full mt-3">
                <Banner />
                <div className="flex justify-center">
                    <HomePage />
                </div>
            </main>
            {/* <main className="w-full flex justify-center mt-3">
                <Banner />
                <HomePage />
            </main> */}

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default App;
