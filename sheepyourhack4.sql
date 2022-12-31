-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 31 Gru 2022, 14:47
-- Wersja serwera: 10.4.27-MariaDB
-- Wersja PHP: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `sheepyourhack4`
--
CREATE DATABASE IF NOT EXISTS `sheepyourhack4` DEFAULT CHARACTER SET utf8 COLLATE utf8_polish_ci;
USE `sheepyourhack4`;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `degree_courses`
--

CREATE TABLE `degree_courses` (
  `id` int(11) NOT NULL,
  `id_university` int(11) NOT NULL,
  `name` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `degree_courses`
--

INSERT INTO `degree_courses` (`id`, `id_university`, `name`) VALUES
(1, 1, 'Informatyka i Systemy Inteligentne'),
(2, 2, 'Informatyka Analityczna'),
(3, 3, 'Informatyka'),
(4, 4, 'Technik Informatyk');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `notes`
--

CREATE TABLE `notes` (
  `id` int(11) NOT NULL,
  `id_author` int(11) NOT NULL,
  `id_degree_course` int(11) NOT NULL,
  `id_subject` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `url` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `upvotes` int(11) NOT NULL DEFAULT 0,
  `approved` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `notes`
--

INSERT INTO `notes` (`id`, `id_author`, `id_degree_course`, `id_subject`, `title`, `url`, `timestamp`, `upvotes`, `approved`) VALUES
(1, 3, 2, 1, 'Niezależność liniowa wektorów', 'https://www.entnet.org/wp-content/uploads/2021/04/Instructions-for-Adding-Your-Logo-2.pdf', '2022-12-17 04:20:11', 37, 0),
(2, 3, 2, 3, 'Jak korzystać z Adobe Acrobat', 'https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf', '2022-12-17 04:20:30', 68, 1),
(3, 6, 4, 1, 'Macierze', '/media/pdf/W14.pdf', '2022-12-17 06:43:03', 12, 0),
(8, 3, 1, 2, 'Całki wymierne', 'uerrel', '2022-12-17 10:37:59', 130, 1),
(13, 3, 2, 2, 'etaewrat', 'aewgawe', '2022-12-18 15:40:42', 0, 0),
(14, 3, 3, 1, 'efwfaew', 'waer', '2022-12-19 19:33:22', 0, 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `id_author` int(11) NOT NULL,
  `id_degree_course` int(11) NOT NULL,
  `id_subject` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `points` int(11) NOT NULL,
  `excercise_set` varchar(200) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `questions`
--

INSERT INTO `questions` (`id`, `id_author`, `id_degree_course`, `id_subject`, `title`, `content`, `points`, `excercise_set`, `timestamp`) VALUES
(2, 3, 1, 1, 'Zadanie od Domki', 'Udowodnij, że 2+2 = 5', 2, 'zestaw 1', '2022-12-17 02:59:41'),
(3, 4, 2, 2, 'Trudna całka', 'Oblicz całkę niewymierną', 5, 'zestaw b', '2022-12-17 03:00:08'),
(4, 3, 1, 1, 'Nowe zadanie', 'Zawartość nowego zadania', 10, 'zestawe afhalewjkajal', '2022-12-17 06:44:25');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `question_answers`
--

CREATE TABLE `question_answers` (
  `id` int(11) NOT NULL,
  `id_author` int(11) NOT NULL,
  `id_question` int(11) NOT NULL,
  `content` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `upvotes` int(11) NOT NULL DEFAULT 0,
  `best_answer` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `question_answers`
--

INSERT INTO `question_answers` (`id`, `id_author`, `id_question`, `content`, `timestamp`, `upvotes`, `best_answer`) VALUES
(1, 3, 3, 'Trzeba to zrobić metodą podstawiania', '2022-12-17 04:27:25', -1, 0),
(2, 4, 3, 'Musisz do tego użyć wzoru na całkę niewłaściwą', '2022-12-17 04:27:55', 1, 0),
(3, 5, 3, 'Dziwna ta całka. Nie umiem tego zrobić', '2022-12-17 07:04:30', 0, 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `subjects`
--

INSERT INTO `subjects` (`id`, `name`) VALUES
(1, 'Algebra'),
(2, 'Analiza matematyczna'),
(3, 'Narzędzia informatyczne\r\n');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `expire_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `universities`
--

CREATE TABLE `universities` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `universities`
--

INSERT INTO `universities` (`id`, `name`) VALUES
(1, 'Akademia Górniczo Hutnicza'),
(2, 'Uniwersytet Jagieloński'),
(3, 'Politechnika Krakowska'),
(4, 'Technikum Łączności');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(256) NOT NULL,
  `type` enum('user','admin') NOT NULL DEFAULT 'user',
  `points` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `type`, `points`) VALUES
(3, 'admin', 'admin', 'admin', 0),
(4, 'admin2', 'admin', 'user', 0),
(5, 'test', 'test', 'user', 0),
(6, 'test1', 'test1', 'user', 0);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `degree_courses`
--
ALTER TABLE `degree_courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_university` (`id_university`);

--
-- Indeksy dla tabeli `notes`
--
ALTER TABLE `notes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_author` (`id_author`),
  ADD KEY `id_subject` (`id_subject`),
  ADD KEY `id_degree_course` (`id_degree_course`);

--
-- Indeksy dla tabeli `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_author` (`id_author`),
  ADD KEY `id_degree_course` (`id_degree_course`),
  ADD KEY `id_subject` (`id_subject`);

--
-- Indeksy dla tabeli `question_answers`
--
ALTER TABLE `question_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_question` (`id_question`),
  ADD KEY `id_author` (`id_author`);

--
-- Indeksy dla tabeli `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`);

--
-- Indeksy dla tabeli `universities`
--
ALTER TABLE `universities`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `degree_courses`
--
ALTER TABLE `degree_courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT dla tabeli `notes`
--
ALTER TABLE `notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT dla tabeli `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT dla tabeli `question_answers`
--
ALTER TABLE `question_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT dla tabeli `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT dla tabeli `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `universities`
--
ALTER TABLE `universities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `degree_courses`
--
ALTER TABLE `degree_courses`
  ADD CONSTRAINT `degree_courses_ibfk_1` FOREIGN KEY (`id_university`) REFERENCES `universities` (`id`);

--
-- Ograniczenia dla tabeli `notes`
--
ALTER TABLE `notes`
  ADD CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`id_author`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `notes_ibfk_2` FOREIGN KEY (`id_degree_course`) REFERENCES `degree_courses` (`id`),
  ADD CONSTRAINT `notes_ibfk_3` FOREIGN KEY (`id_subject`) REFERENCES `subjects` (`id`);

--
-- Ograniczenia dla tabeli `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`id_author`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`id_degree_course`) REFERENCES `degree_courses` (`id`),
  ADD CONSTRAINT `questions_ibfk_3` FOREIGN KEY (`id_subject`) REFERENCES `subjects` (`id`);

--
-- Ograniczenia dla tabeli `question_answers`
--
ALTER TABLE `question_answers`
  ADD CONSTRAINT `question_answers_ibfk_1` FOREIGN KEY (`id_question`) REFERENCES `questions` (`id`),
  ADD CONSTRAINT `question_answers_ibfk_2` FOREIGN KEY (`id_author`) REFERENCES `users` (`id`);

--
-- Ograniczenia dla tabeli `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
