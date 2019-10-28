-- --------------------------------------------------------
-- Хост:                         127.0.0.1
-- Версия сервера:               5.6.41-log - MySQL Community Server (GPL)
-- Операционная система:         Win64
-- HeidiSQL Версия:              10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Дамп структуры базы данных phonebook
CREATE DATABASE IF NOT EXISTS `phonebook` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `phonebook`;

-- Дамп структуры для таблица phonebook.contact
CREATE TABLE IF NOT EXISTS `contact` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL DEFAULT '',
  `number` varchar(20) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `number` (`number`)
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8;

-- Дамп данных таблицы phonebook.contact: ~16 rows (приблизительно)
DELETE FROM `contact`;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
INSERT INTO `contact` (`id`, `name`, `number`) VALUES
	(1, 'John', '+7(999)999-99-99'),
	(28, 'Seddychdf', '8(112)775-11-48'),
	(43, 'KennyLLc', '8(112)777-11-48'),
	(44, 'Wolfgang', '8(112)777-88-89'),
	(45, 'John', '7878997987'),
	(48, 'Bill', '89532966706'),
	(58, 'Bill', '89532966709'),
	(59, 'New', '87777777777'),
	(60, 'Contact2', '84444444444'),
	(61, 'Contact34', '899696969696'),
	(62, 'Contact5', '8122222222222'),
	(63, 'Contact56', '8545454545454'),
	(64, 'Contact33', '845454545456'),
	(65, 'ContaCT778', '81569955959'),
	(66, 'Contact999', '8123546464'),
	(67, 'Den Wise', '98989898');
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
