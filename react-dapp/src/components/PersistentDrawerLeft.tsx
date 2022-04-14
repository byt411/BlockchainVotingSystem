import * as React from 'react';
import { Link } from 'react-router-dom';

import {
    AddBoxOutlined, BallotOutlined, CompareArrows, HowToVoteOutlined, PollOutlined, UploadOutlined
} from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import { ListItemButton, Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';

import { electionTitle } from '../Common';

const drawerWidth = 225;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));
interface PersistentDrawerProps {
  showCreator?: boolean;
}

const PersistentDrawerLeft: React.FC<PersistentDrawerProps> = ({
  showCreator,
}) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="absolute"
        open={open}
        style={{ background: "transparent", boxShadow: "none" }}
      >
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#c5c6c7",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem>
            <Typography variant="body2">{electionTitle}</Typography>
          </ListItem>
          <ListItemButton component={Link} to="/">
            <ListItemIcon>
              <CompareArrows />
            </ListItemIcon>
            <ListItemText
              primary="Change Election"
              primaryTypographyProps={{ variant: "subtitle1" }}
            ></ListItemText>
          </ListItemButton>
        </List>
        <Divider />
        <List>
          <ListItemButton component={Link} to="/vote">
            <ListItemIcon>
              <HowToVoteOutlined />
            </ListItemIcon>
            <ListItemText
              primary="Vote"
              primaryTypographyProps={{ variant: "subtitle1" }}
            ></ListItemText>
          </ListItemButton>
          <ListItemButton component={Link} to="/results">
            <ListItemIcon>
              <PollOutlined />
            </ListItemIcon>
            <ListItemText
              primary="Results"
              primaryTypographyProps={{ variant: "subtitle1" }}
            ></ListItemText>
          </ListItemButton>
          <ListItemButton component={Link} to="/verification">
            <ListItemIcon>
              <BallotOutlined />
            </ListItemIcon>
            <ListItemText
              primary="Verification"
              primaryTypographyProps={{ variant: "subtitle1" }}
            ></ListItemText>
          </ListItemButton>
          {showCreator && (
            <ListItemButton component={Link} to="/publishresults">
              <ListItemIcon>
                <UploadOutlined />
              </ListItemIcon>
              <ListItemText
                primary="Upload Results"
                primaryTypographyProps={{ variant: "subtitle1" }}
              ></ListItemText>
            </ListItemButton>
          )}
        </List>
        <Divider />
        <List>
          <ListItemButton component={Link} to="/deploy">
            <ListItemIcon>
              <AddBoxOutlined />
            </ListItemIcon>
            <ListItemText
              primary="Create Election"
              primaryTypographyProps={{ variant: "subtitle1" }}
            ></ListItemText>
          </ListItemButton>
        </List>
      </Drawer>
    </Box>
  );
};

export default PersistentDrawerLeft;
