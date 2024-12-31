import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#5F7D5A",
    padding: "10px 0",
    textAlign: "center",
    color: "white",
    fontSize: "24px",
  },
  footer: {
    marginTop: "auto",
    backgroundColor: "#5F7D5A",
    padding: "10px 0",
    textAlign: "center",
    color: "white",
    fontSize: "14px",
  },
  card: {
    maxWidth: 600,
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "transparent",
    boxShadow: "0px 9px 70px 0px rgb(0 0 0 / 30%)",
    borderRadius: "15px",
  },
  backButton: {
    marginTop: "20px",
    backgroundColor: "#5F7D5A",
    color: "white",
  },
  responseText: {
    fontSize: "16px",
    lineHeight: "1.5",
    marginBottom: "20px",
  },
}));

const ResponsePage = ({ response }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/pdd");
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>Plant Disease Information</div>
      <Container maxWidth="md">
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h5" component="h2" align="center">
              Disease Information Response
            </Typography>
            <div className={classes.responseText}>
              {response &&
                response
                  .split(". ")
                  .map((sentence, index) => (
                    <p key={index}>{sentence.trim()}.</p>
                  ))}
            </div>
            <Button
              variant="contained"
              className={classes.backButton}
              onClick={handleBack}
            >
              Back
            </Button>
          </CardContent>
        </Card>
      </Container>
      <div className={classes.footer}>© 2024 Plant Disease Classification</div>
    </div>
  );
};

export default ResponsePage;
