import React, {useEffect} from 'react';
import jwt_decode from "jwt-decode";
import { makeStyles,useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from '@material-ui/icons/Menu';
import Footer from '../footer/Footer'
import {AccountCircle} from "@material-ui/icons";
import Login from "../authentication/Login";
import SignUp from "../authentication/SignUp";
import CompanyProfile from "../authentication/CompanyProfile";
import FeedbackIcon from '@material-ui/icons/Feedback';
import InfoIcon from '@material-ui/icons/Info';
import Logout from "../authentication/Logout";
import {Switch, Route, useHistory} from "react-router";
import Home from "../Home";
import About from "../About";
import Plans from "../Plans/Plans"
import {Brightness4, Brightness7} from "@material-ui/icons";
import {ThemeContext} from "../../context/ThemeContext";
import Button from '@material-ui/core/Button';
import Profile from '../Profile';


const drawerWidth = 240;
const useStyles = makeStyles((theme)=>({
    root : {
        display: 'flex'
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    space : {
        marginRight: theme.spacing(3),
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.primary,
        color: theme.palette.text.primary,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
          display: 'flex',
        }
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    themer: {
        color: theme.palette.text.primary,
        marginRight : 5
    }
}))

const Navbar = ()=>{
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [loggedIn, setLoggedIn] = React.useState(true);
    const [signUp, setSignUp] = React.useState(false);
    const [logout, setLogout] = React.useState(false);
    const [title,setTitle] = React.useState("");
    const {dark, toggleTheme} = React.useContext(ThemeContext);
    const [openProfile, setOpenProfile] = React.useState(false);
    const handleProfileClickOpen = () => setOpenProfile(true);
    const handleDrawerToggle = () => setOpen(!open);
    const history = useHistory();
    const setLogin = ()=>setLoggedIn(loggedIn=>!loggedIn);
    const [token,setToken] = React.useState(localStorage.getItem('token'))

    useEffect(() => {
        if(token === null) {
            history.push('/login');
            setLoggedIn(false)
            setTitle("RaterNet")
        } else{
            let user = jwt_decode(token);
            history.push('/');
            setLoggedIn(true)
            setTitle(user.asn)
        }
    }, [token])

    
    return (
        <div>
        <div className={classes.root}>
             <CssBaseline />
             <AppBar position="fixed" className={classes.appBar}>
                <Toolbar variant='dense'>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => setOpen(!open)}
                        edge="start"
                        className={classes.menuButton}>
                        <MenuIcon />
                    </IconButton> 
                    <Typography variant="h6" noWrap href='/'>{title}</Typography>
                    <div className={classes.space}/>
                    <div className={classes.grow}/>
                    <IconButton edge='end' className={classes.themer} onClick={toggleTheme}>
                        {dark ? <Brightness7/>: <Brightness4/>}
                    </IconButton>
                    {loggedIn ? 
                    <div className={classes.sectionDesktop}>
                        <Button variant="outlined" color="inherit" onClick={() => setLogout(true)}>Logout</Button>
                    </div> : 
                     <div className={classes.sectionDesktop}>
                        <Button variant="outlined" color="inherit" onClick={() => setSignUp(signUp=>!signUp)}>SignUp</Button>
                    </div>}
                </Toolbar>
             </AppBar>
             <Drawer
                className={classes.drawer}
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={open}
                onClose={handleDrawerToggle}
                classes={{
                    paper: classes.drawerPaper,
                }}>
                <Toolbar variant='dense' />
                <div className={classes.drawerContainer}>
                    <List>
                        {loggedIn ?  <ListItem button key={'Profile'} onClick={()=>{
                            history.push('/profile')
                        }}>
                            <ListItemIcon> <AccountCircle/></ListItemIcon>
                            <ListItemText primary={'Profile'} />
                        </ListItem>: null}
                        {loggedIn ?  <ListItem button key={'Plans'} onClick={() => history.push('/plans')}>
                            <ListItemIcon><FeedbackIcon/></ListItemIcon>
                            <ListItemText primary={'Plans'}/>
                        </ListItem>: null}
                        <ListItem button key={'About'} onClick={() => history.push('/about')}>
                            <ListItemIcon><InfoIcon/></ListItemIcon>
                            <ListItemText primary={'About'} />
                        </ListItem>
                    </List>
                    <Divider/>
                </div>
            </Drawer>
            <Logout open={logout} setOpen={setLogout} setLoggedIn={setLoggedIn} setDrawerOpen={setOpen} setTitle={setTitle}/>
            <SignUp open={signUp} setOpen={setSignUp} setTitle={setTitle}/>
            <main style={{
                width : '100%',
                justifyContent : 'center',
                padding : 30,
                alignItems : 'center'
            }}>
                <Toolbar variant='dense'/>
                <Switch>
                    <Route exact path='/' component={Home}/>
                    <Route exact path='/about' component={About}/>
                    <Route exact path='/login' component={()=>
                    <Login setloggedIn={setLogin}  
                        setToken={setToken}/>}/>
                    <Route exact path='/profile' component={Profile}/>
                    <Route exact path='/plans' component={Plans}/>
                </Switch>
            </main>
            
        </div>
        <Footer/>
        </div>
    )
} 

export default Navbar;
