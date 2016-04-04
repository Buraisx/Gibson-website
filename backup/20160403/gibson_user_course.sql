-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: 192.168.1.33    Database: gibson
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
-- Table structure for table `user_course`
--

DROP TABLE IF EXISTS `user_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_course` (
  `enrollment_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `course_id` int(10) unsigned NOT NULL,
  `enroll_date` date NOT NULL,
  `original_price` decimal(16,2) NOT NULL,
  `actual_price` decimal(16,2) NOT NULL COMMENT 'Original Price - Discount + Additional and incidental fees ',
  `paid` tinyint(1) NOT NULL COMMENT 'If in future, paying in installments is allowed, let 2 be partially paid (Set to TINYINT(2))',
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('Waitlisted','Enrolled','Cancelled') NOT NULL DEFAULT 'Waitlisted' COMMENT 'Status of enrollment for user user_id into course course_id:\nAccepted Input: "Waitlisted", "Enrolled", "Cancelled"',
  `notes` text NOT NULL,
  PRIMARY KEY (`enrollment_id`),
  UNIQUE KEY `enrollment_d_UNIQUE` (`enrollment_id`),
  KEY `user_id` (`user_id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8 COMMENT='History of users currently enrolled into courses';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_course`
--

LOCK TABLES `user_course` WRITE;
/*!40000 ALTER TABLE `user_course` DISABLE KEYS */;
INSERT INTO `user_course` VALUES (10,2,5,'2016-03-05',49.00,49.00,1,'2016-04-01','2016-05-01','Enrolled','Registered for course ID 5'),(11,2,4,'2016-03-05',49.00,49.00,1,'2016-04-01','2016-05-01','Enrolled','Registered for course ID 4'),(12,2,3,'2016-03-05',49.00,49.00,1,'2016-04-01','2016-05-01','Enrolled','Registered for course ID 3'),(13,2,2,'2016-03-05',7.00,7.00,1,'2016-04-01','2016-05-01','Enrolled','Registered for course ID 2'),(14,2,1,'2016-03-05',30.00,30.00,1,'2016-04-01','2016-05-01','Enrolled','Registered for course ID 1'),(15,3,5,'2016-03-05',49.00,49.00,1,'2016-04-01','2016-05-01','Enrolled','Registered for course ID 5'),(16,3,4,'2016-03-05',49.00,49.00,1,'2016-04-01','2016-05-01','Enrolled','Registered for course ID 4'),(17,3,3,'2016-03-05',49.00,49.00,1,'2016-04-01','2016-05-01','Enrolled','Registered for course ID 3'),(19,1,4,'2016-03-19',49.00,49.00,1,'2016-04-01','2016-05-01','Enrolled','Registered for course ID 4'),(20,3,1,'2016-03-25',30.00,30.00,1,'2016-04-01','2016-05-01','Enrolled','Registered for course ID 1');
/*!40000 ALTER TABLE `user_course` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-03 18:35:59
