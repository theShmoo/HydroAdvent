import React, { Component } from 'react';
import PropTypes from 'prop-types';
import seedrandom from 'seedrandom'

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';

import withRoot from './withRoot';
import { users } from './users';
import { goodDeeds } from './GoodDeeds';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  main: {
    padding: theme.spacing(2),
    margin: theme.spacing(1),
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  }
});

const Months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September',
  'Oktober', 'November', 'Dezember'];

const Checklist = ({ items, day, classes }) => {
  const listItems = items.map((item, i) => <ListItem key={i} button>
    <ListItemIcon>
      <CheckCircleIcon />
    </ListItemIcon>
    <ListItemText primary={item} />
  </ListItem>
  );
  return <List component="nav" className={classes.list}>
    {listItems}
  </List>
}

function shuffleArray(arr, rng) {
  let shuffled = arr;
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

class App extends Component {
  state = {
    user: "",
    day: new Date().getDate()
  };

  handleChange = event => {
    this.setState({ user: event.target.value });
  };

  handlePrevClick = event => {
    this.setState(prevstate => ({ day: prevstate.day - 1 }));
  };

  handleNextClick = event => {
    this.setState(prevstate => ({ day: prevstate.day + 1 }));
  };

  render() {
    const { classes } = this.props;
    const { user, day } = this.state;
    const userItems = users.map(
      (u, i) => <MenuItem key={i} value={u}>{u}</MenuItem>
    );
    const myrng = new seedrandom(user);
    let shuffledDeeds = [...goodDeeds];
    shuffleArray(shuffledDeeds, myrng);
    const startIndex = ((day - 1) * 3) % shuffledDeeds.length;
    const selection = [
      shuffledDeeds[startIndex],
      shuffledDeeds[startIndex + 1],
      shuffledDeeds[startIndex + 2]];

    const month = Months[new Date().getMonth()];

    return <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.flex}>
            Hydro Advent Challenges
          </Typography>
        </Toolbar>
      </AppBar>
      <Paper square elevation={4} className={classes.main}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <form className={classes.form}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="user">Benutzer</InputLabel>
                <Select
                  value={user}
                  displayEmpty
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'currentUser',
                    id: 'user',
                  }}
                >
                  {userItems}
                </Select>
              </FormControl>
            </form>
          </Grid>
          <Grid item xs={12}>
            {user ?
              <div>
                <Typography variant="body1" color="inherit">
                  Versuche diese gute Taten zu erfüllen.
                  <br />
                  Deine Aufgaben vom {day}. {month}
                </Typography>
                {day > 14 ?
                  <Button variant="contained" color="secondary" className={classes.button} onClick={this.handlePrevClick}>
                    {day - 1}. {month}
                  </Button>
                  : ""}
                {day < new Date().getDate() ?
                  <Button variant="contained" color="secondary" className={classes.button} onClick={this.handleNextClick}>
                    {day + 1}. {month}
                  </Button>
                  : ""}
                <Checklist items={selection} classes={classes} />
                <Typography variant="body1" color="inherit">
                  Für jede erfüllte Challenge dürft ihr auf dem folgenden Mural Board etwas gestalten:
                </Typography>
                <Button variant="contained"
                  color="primary"
                  className={classes.button}
                  href="https://app.mural.co/t/sindbad5723/m/sindbad5723/1607887078116/2f2d3a82d4194ce8aa25cdc3aa36835c0efff3c6"
                  target="_blank">
                  Mural-Zeichen-Board
                </Button>
                <Typography variant="body1" color="inherit">
                  Unser Vorschlag hierzu: überlegt euch beim ersten Hinzufügen eine Farbe die noch nicht am Board vertreten ist und fügt für jede von euch erledigte Challenge etwas in dieser Farbe hinzu (zb ein Punkt oder ein Postit) so dass am Schluss etwas gemeinsames entsteht.
                </Typography>
              </div>
              : <Typography variant="body1" color="inherit">
                Wähle deinen Namen
              </Typography>
            }
          </Grid>
        </Grid>
      </Paper>
    </div >
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRoot(withStyles(styles)(App));
