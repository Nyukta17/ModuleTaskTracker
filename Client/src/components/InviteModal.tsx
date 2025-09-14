import React, { useState } from 'react';
import '../style/InviteModal.css';
import { Button } from 'react-bootstrap';

interface InviteModalProps {
  link: string;
  onClose: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ link, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="invite-modal-overlay">
      <div className="invite-modal">
        <h3>Ссылка для регистрации</h3>
        <p className="invite-link">{link}</p>
        <button onClick={copyToClipboard} className="btn-copy">
          {copied ? "Скопировано!" : "Копировать"}
        </button>
        <Button onClick={onClose} className="btn-close">
        </Button>
      </div>
    </div>
  );
};

export default InviteModal;
