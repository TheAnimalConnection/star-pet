import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
  useParams,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";

import AnimalsPage from "../Animals/AnimalsPage/AnimalsPage";
import AnimalDetail from "../Animals/AnimalDetail/AnimalDetail";
import JobPage from "../Job/JobsPage/JobsPage";
import JobDetail from "../Job/JobDetail/JobDetail";
import Contacts from "../Contacts/ContactPage/ContactPage";
import ContactDetail from "../Contacts/ContactDetail/ContactDetail";
import ContactForm from "../Contacts/contactForm/contactForm";
import AnimalForm from "../Animals/AnimalForm/AnimalForm"


import UserPage from "../UserPage/UserPage";
import InfoPage from "../InfoPage/InfoPage";
import LandingPage from "../LandingPage/LandingPage";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";

import "./App.css";

function App() {
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);

  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
          <Redirect exact from="/" to="/animals" />

          {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}
          <ProtectedRoute
            // logged in shows UserPage else shows LoginPage
            exact
            path="/user"
          >
            <UserPage />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows UserPage else shows LoginPage
            exact
            path="/contacts"
          >
            <Contacts />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows AnimalPage else shows LoginPage
            exact
            path="/animals"
          >
            <AnimalsPage />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows AnimalDetail else shows LoginPage
            exact
            path="/animals/add/:id" //1<<<<<<<<<<<<<<<<<<<<<<!!!!
          >
            <AnimalForm />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows AnimalDetail else shows LoginPage
            exact
            path="/animals/:id" //1<<<<<<<<<<<<<<<<<<<<<<!!!!
          >
            <AnimalDetail />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows AnimalPage else shows LoginPage
            exact
            path="/jobs"
          >
            <JobPage />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows JobDetailPage else shows LoginPage
            exact
            path="/jobDetail/:id"
          >
            <JobDetail />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows JobDetailPage else shows LoginPage
            exact
            path="/contacts/:id"
          >
            <ContactDetail />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows ContactDetailPage else shows LoginPage
            exact
            path="/contactForm"
          >
            <ContactForm />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows InfoPage else shows LoginPage
            exact
            path="/info"
          >
            <InfoPage />
          </ProtectedRoute>

          <Route exact path="/login">
            {user.id ? (
              // If the user is already logged in,
              // redirect to the /user page
              <Redirect to="/animals" />
            ) : (
              // Otherwise, show the login page
              <LoginPage />
            )}
          </Route>

          <Route exact path="/registration">
            {user.id ? (
              // If the user is already logged in,
              // redirect them to the /user page
              <Redirect to="/animal" />
            ) : (
              // Otherwise, show the registration page
              <RegisterPage />
            )}
          </Route>

          <Route exact path="/home">
            {user.id ? (
              // If the user is already logged in,
              // redirect them to the /user page
              <Redirect to="/animals" />
            ) : (
              // Otherwise, show the Landing page
              <LandingPage />
            )}
          </Route>

          {/* If none of the other routes matched, we will show a 404. */}
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
