import './App.css';
import Header from './Components/Header/Header';
import HomePage from './Components/HomePage/HomePage';
import Footer from './Components/Footer/Footer';

function App() {
    return (
        <div className="w-full">
            <header>
                <Header />
            </header>

            <main className="w-full flex justify-center mt-3">
                <HomePage />
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default App;
