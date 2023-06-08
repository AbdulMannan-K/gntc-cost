import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {useNavigate} from "react-router-dom";
import {getAuth} from "firebase/auth";

const pages = [{label:'Calendar',path:'/calendar'}, {label:'Clients',path:'/companies'}, {label:'Reports',path:'/reports'},{label:'Employees',path:'/employees'}];
const settings = ['Profile', 'Account', 'Dashboard', 'Log out'];

function Navbar() {

    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static" sx={{bgcolor:'#29AB87',height:'80px'}}>
            <div style={{marginLeft:20,marginRight:20}}>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',

                    }}
                >

                <Toolbar disableGutters>
                    <Box
                        component="img"
                        sx={{
                            height: '70px',
                            display: { xs: 'none', md: 'flex' },
                        }}
                        alt="gntc cost logo"
                        src="gntc_logo.jpg"
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 200,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Planifikimi i Pagesave
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.label} onClick={()=>{handleCloseNavMenu();navigate(page.path)}}
                                >
                                    <Typography textAlign="center">{page.label}</Typography>
                                </MenuItem>
                            ))}
                            <MenuItem key={'logout'} onClick={()=>{handleCloseNavMenu();
                                localStorage.removeItem('Auth Token');
                                localStorage.removeItem('employee')
                                localStorage.removeItem('Role')
                                const auth = getAuth();
                                auth.signOut();
                                navigate('/login')}}>
                                <Typography textAlign="center">Logout</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                    <Box
                        component="img"
                        sx={{
                            height: '60px',
                            display: { xs: 'flex', md: 'none' },
                        }}
                        alt="gntc cost logo"
                        src="gntc_logo.jpg"
                    />
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page.label}
                                onClick={()=>{handleCloseNavMenu();navigate(page.path)}}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.label}
                            </Button>
                        ))}
                    </Box>


                </Toolbar>
                    <Box sx={{ flexGrow: 1,justifyContent:'flex-end', display: { xs: 'none', md: 'flex' } }}>
                        <Button
                            key={'logout'}
                            onClick={()=>{
                                localStorage.removeItem('Auth Token');
                                localStorage.removeItem('employee')
                                localStorage.removeItem('Role')
                                const auth = getAuth();
                                auth.signOut();
                                navigate('/login')}
                            }
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {localStorage.getItem('employee')?'Logout, '+ localStorage.getItem('employee'):''}
                        </Button>
                    </Box>
                </div>
            </div>
        </AppBar>
    );
}
export default Navbar;
