import React, { useState, useEffect, useRef } from "react";
import { Button, ProgressBar, Container, Row, Col, Form } from "react-bootstrap";

const Pomodoro: React.FC = () => {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setSecondsLeft((isWorkTime ? workMinutes : breakMinutes) * 60);
  }, [workMinutes, breakMinutes, isWorkTime]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === 0) {
            setIsWorkTime((prevWork) => !prevWork);
            return (isWorkTime ? breakMinutes : workMinutes) * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isWorkTime, workMinutes, breakMinutes]);

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  const progressPercent = isWorkTime
    ? ((workMinutes * 60 - secondsLeft) / (workMinutes * 60)) * 100
    : ((breakMinutes * 60 - secondsLeft) / (breakMinutes * 60)) * 100;

  const toggleRunning = () => {
    setIsRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setSecondsLeft((isWorkTime ? workMinutes : breakMinutes) * 60);
    setIsRunning(false);
  };

  return (
    <Container style={{ maxWidth: 400, textAlign: "center", marginTop: 20 }}>
      <h2>{isWorkTime ? "Время работать" : "Перерыв"}</h2>

      <Form>
        <Form.Group controlId="workSelect">
          <Form.Label>Интервал работы (минуты):</Form.Label>
          <Form.Control
            as="select"
            value={workMinutes}
            onChange={(e) => setWorkMinutes(Number(e.target.value))}
            disabled={isRunning}
          >
            {[15, 20, 25, 30, 45, 50].map((min) => (
              <option key={min} value={min}>
                {min}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="breakSelect" style={{ marginTop: 20 }}>
          <Form.Label>Интервал перерыва (минуты):</Form.Label>
          <Form.Control
            as="select"
            value={breakMinutes}
            onChange={(e) => setBreakMinutes(Number(e.target.value))}
            disabled={isRunning}
          >
            {[3, 5, 7, 10].map((min) => (
              <option key={min} value={min}>
                {min}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      </Form>

      <h1 style={{ fontSize: "4rem", margin: "20px 0" }}>
        {minutes}:{seconds}
      </h1>

      <ProgressBar
        now={progressPercent}
        label={`${Math.round(progressPercent)}%`}
        animated={isRunning}
        variant={isWorkTime ? "danger" : "info"}
        style={{ height: "20px", marginBottom: "20px" }}
      />

      <Row className="justify-content-center">
        <Col xs="auto">
          <Button onClick={toggleRunning} variant={isRunning ? "warning" : "success"}>
            {isRunning ? "Пауза" : "Старт"}
          </Button>
        </Col>
        <Col xs="auto">
          <Button onClick={resetTimer} variant="secondary">
            Сбросить
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Pomodoro;