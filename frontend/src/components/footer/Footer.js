import React from 'react';
import * as UI from '@mui/material';
import * as UIIcons from '@mui/icons-material'
import * as UIStyles from '@mui/styles'
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';

const useStyles = UIStyles.makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    width:'100%',
    left: 0,
    bottom: 0,
    zIndex: 2,
    position : 'relative',
    maxHeight: '150vh',
    flexShrink : 0
  },
  container: {
    [theme.breakpoints.up('md')] : {
      display : 'flex',
      margin: 10,
      justify : 'space-between',
      alignItems:'center'
    }
  },
  logo :{
      display : 'flex',
      margin: 20,
      justifyContent : 'center',
      alignItems:'center'
  },
  grow: {
      flexGrow: 1,
  },
  info : {
    display : 'flex',
    [theme.breakpoints.down('md')]:{
      justifyContent:'center',
      alignItems:'center'
    }
  },
  list : {
    [theme.breakpoints.down('md')]:{
      display:'flex',
      justifyContent:'center',
      alignItems:'center'
    }
  },
  form : {
    display : 'flex',
    marginRight : 10,
    justifyContent:'center',
    alignItems:'center'
  },
  listItem : {
    margin : 10,
    [theme.breakpoints.up('md')]:{
     marginLeft:50
    }
  },
  extra : {
    [theme.breakpoints.down('md')]:{
      justifyContent:'center',
      textAlign:'center',
      marginTop : 20
    }
  }
}));


const Footer = (props) => {
  const classes = useStyles();
  
  const icons = [
    <UIIcons.Instagram fontSize="large" color="primary" />,
    <UIIcons.Facebook fontSize="large" color="primary" />,
    <UIIcons.LinkedIn fontSize="large" color="primary" />,
  ];
  
  const list = ["Profile", "Plans", "Customer Support", "About"];
  
  return (
    <footer className={classes.footer}>
      <UI.Container maxWidth="lg" className={classes.container}>
        <div className={classes.logo}>
          <UI.IconButton color="inherit">
            <NetworkCheckIcon fontSize="large" />
          </UI.IconButton>
          <UI.Typography variant="h5">RaterNet</UI.Typography>
        </div>
        
        {/* ✅ Added unique key in list.map() */}
        <div className={classes.list}>
          {list.map((item, index) => (
            <UI.Typography
              key={index} // ✅ Unique key added
              variant="subtitle1"
              color="inherit"
              className={classes.listItem}
            >
              {item}
            </UI.Typography>
          ))}
        </div>
        
        <div className={classes.grow} />
        
        {/* ✅ Added unique key in icons.map() */}
        <div className={classes.info}>
          {icons.map((icon, index) => (
            <UI.IconButton key={index} color="primary"> {/* ✅ Unique key added */}
              {icon}
            </UI.IconButton>
          ))}
        </div>
      </UI.Container>
    </footer>
  );
};


export default Footer;