-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: prod-gibson-instance.cdvppcqaisw3.us-west-2.rds.amazonaws.com    Database: gibson
-- ------------------------------------------------------
-- Server version	5.7.10-log

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
-- Table structure for table `course_days`
--

DROP TABLE IF EXISTS `course_days`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `course_days` (
  `course_id` int(10) unsigned NOT NULL,
  `date` date NOT NULL,
  `start_time` time(4) NOT NULL,
  `end_time` time(4) NOT NULL,
  `type` enum('SCHEDULED','ADHOC') NOT NULL DEFAULT 'ADHOC',
  `status` enum('SCHEDULED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
  `note` text COMMENT 'If classes are rescheduled, please mention in note',
  KEY `course_id` (`course_id`),
  KEY `date` (`date`),
  CONSTRAINT `course` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_days`
--

LOCK TABLES `course_days` WRITE;
/*!40000 ALTER TABLE `course_days` DISABLE KEYS */;
INSERT INTO `course_days` VALUES (28,'2016-05-07','11:00:00.0000','11:45:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(28,'2016-05-14','11:00:00.0000','11:45:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(28,'2016-05-21','11:00:00.0000','11:45:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(28,'2016-05-28','11:00:00.0000','11:45:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(28,'2016-06-04','11:00:00.0000','11:45:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(28,'2016-06-11','11:00:00.0000','11:45:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(28,'2016-06-18','11:00:00.0000','11:45:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(28,'2016-06-25','11:00:00.0000','11:45:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(30,'2016-07-09','11:00:00.0000','11:45:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(30,'2016-07-16','11:00:00.0000','11:45:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(30,'2016-07-23','11:00:00.0000','11:45:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(30,'2016-07-30','11:00:00.0000','11:45:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(30,'2016-08-06','11:00:00.0000','11:45:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(30,'2016-08-13','11:00:00.0000','11:45:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(30,'2016-08-20','11:00:00.0000','11:45:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(30,'2016-08-27','11:00:00.0000','11:45:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(31,'2016-05-07','10:15:00.0000','11:00:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(31,'2016-05-14','10:15:00.0000','11:00:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(31,'2016-05-21','10:15:00.0000','11:00:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(31,'2016-05-28','10:15:00.0000','11:00:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(31,'2016-06-04','10:15:00.0000','11:00:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(31,'2016-06-11','10:15:00.0000','11:00:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(31,'2016-06-18','10:15:00.0000','11:00:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(31,'2016-06-25','10:15:00.0000','11:00:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(32,'2016-07-09','10:15:00.0000','11:00:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(32,'2016-07-16','10:15:00.0000','11:00:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(32,'2016-07-23','10:15:00.0000','11:00:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(32,'2016-07-30','10:15:00.0000','11:00:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(32,'2016-08-06','10:15:00.0000','11:00:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(32,'2016-08-13','10:15:00.0000','11:00:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(32,'2016-08-20','10:15:00.0000','11:00:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time'),(32,'2016-08-27','10:15:00.0000','11:00:00.0000','SCHEDULED','SCHEDULED','Scheduled Course Time');
/*!40000 ALTER TABLE `course_days` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-14 22:05:27
