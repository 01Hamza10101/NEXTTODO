import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "TODO.",
  description: "Next Todo app",
};

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Todolayout from "./@todo/layout";
import store from "./lib/ReduxToolkit/store/store.js";
// import { Provider } from 'react-redux';
import ReduxProvider from "./lib/ReduxToolkit/ReduxProvider";

import Authprovider from "./components/AuthProvider/authprovider";

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReduxProvider store={store}>
          <Authprovider>
            <ToastContainer />
            {children}
          </Authprovider>
        </ReduxProvider>
      </body>
    </html>
  );
}
