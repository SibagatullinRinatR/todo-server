CREATE TABLE IF NOT EXISTS person (
    id INT GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50),
    surname VARCHAR(50),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS todo (
    id INT GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(50),
    content VARCHAR(200),
    user_id INT,
    PRIMARY KEY(id),
    CONSTRAINT fk_person FOREIGN KEY (user_id) REFERENCES person(id)
);




