import "../styles/globals.css";

//INTERNAL IMPORT
import { VotingProvider } from "../context/Voter";
import Navbar from "../components/NavBar/NavBar";

function MyApp({ Component, pageProps }) {
  return (
    <VotingProvider>
      <div>
        <Navbar />
        <div>
          <Component {...pageProps} />
        </div>
      </div>
    </VotingProvider>
  );
}

export default MyApp;
