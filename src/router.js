import {Switch, Route, HashRouter, Redirect} from "react-router-dom"
import React from "react"
import Home from "../src/components/Home"
import Login from "../src/components/Login"




export default function Router(props) {
    return (
        <HashRouter>
        <Switch>
          <Route path="/" component={Home}/>
          {/* <Route path="/profile" render={()=>(props.logedin ? <Profile/> : <Redirect to="/" /> )} />
          <Route exact path="/" component={Login}/> */}
       </Switch>
    </HashRouter>
    )
}




