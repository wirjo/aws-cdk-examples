CREATE TABLE conversations (  
    id INT NOT NULL PRIMARY KEY,  
    name VARCHAR(255) NOT NULL,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
);  
  
CREATE TABLE messages (  
    id VARCHAR(36) PRIMARY KEY,  
    conversation_id INT NOT NULL,  
    sub VARCHAR(36) NOT NULL,  
    body TEXT NOT NULL,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)  
);  
  
CREATE TABLE conversation_participants (  
    conversation_id INT NOT NULL,  
    sub varchar(36) NOT NULL,  
    last_read_at TIMESTAMP,  
    PRIMARY KEY (conversation_id, sub),  
    FOREIGN KEY (conversation_id) REFERENCES conversations(id)  
);