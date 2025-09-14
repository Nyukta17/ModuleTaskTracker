import React from "react";
import { Alert, Container } from "react-bootstrap";

const RegistrationExpiredAlert: React.FC = () => {
  return (
    <Container className="p-5 text-center">
      <Alert variant="danger">
        Время регистрации истекло. Пожалуйста, обратитесь к вашему руководителю для получения помощи.
      </Alert>
    </Container>
  );
};

export default RegistrationExpiredAlert;
