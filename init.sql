-- Tabela para armazenar informações dos usuários
CREATE TABLE users (
    id UUID PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para armazenar as salas de chat
CREATE TABLE rooms (
    id UUID PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para armazenar as mensagens, com referência ao usuário e à sala
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    text TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID NOT NULL,
    room_id UUID NOT NULL,
    username VARCHAR(255) NOT NULL, -- Para simplificar a busca sem joins complexos
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms (id) ON DELETE CASCADE
);

-- Índices para otimizar as buscas
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_timestamp ON messages("timestamp");
