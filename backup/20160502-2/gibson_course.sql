<<<<<<< HEAD
-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
=======
-- MySQL dump 10.13  Distrib 5.7.9, for Win32 (AMD64)
>>>>>>> signupMod
--
-- Host: localhost    Database: gibson
-- ------------------------------------------------------
-- Server version	5.7.11-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course` (
  `course_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `course_code` varchar(32) NOT NULL,
  `course_name` varchar(64) NOT NULL,
  `instructor_username` varchar(32) DEFAULT NULL,
  `instructor_name` varchar(256) DEFAULT NULL,
  `default_fee` decimal(16,2) NOT NULL COMMENT 'Discounts TBD by other ppl',
  `course_limit` int(10) unsigned DEFAULT NULL COMMENT 'If null then course has no maximum participants',
  `payment_period_id` int(10) unsigned DEFAULT NULL COMMENT 'foreign key to another table called payment period which ids each payment type',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `course_time` varchar(45) DEFAULT NULL COMMENT 'I''m leaving this up to Benji/Allen/Timmy',
  `course_interval` enum('Weekly','Bi-weekly','Daily') NOT NULL COMMENT 'Accepted Input: Weekly, Bi-weekly, Monthly',
  `course_language` json DEFAULT NULL COMMENT 'Languages used in the course',
  `course_days` json DEFAULT NULL COMMENT 'Accepted input should be: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday',
  `course_tags` json DEFAULT NULL,
  `course_target` text NOT NULL,
  `course_description` text NOT NULL,
  `instructor_bio` text,
  `categories` json DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`course_id`),
  UNIQUE KEY `course_id_UNIQUE` (`course_id`)
<<<<<<< HEAD
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='Table for courses';
/*!40101 SET character_set_client = @saved_cs_client */;
=======
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='Table for courses';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;
>>>>>>> signupMod
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

<<<<<<< HEAD
-- Dump completed on 2016-05-02 16:11:04
=======
-- Dump completed on 2016-05-02 20:57:43
>>>>>>> signupMod
