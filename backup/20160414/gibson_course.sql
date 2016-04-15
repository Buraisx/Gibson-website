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
  `notes` text,
  PRIMARY KEY (`course_id`),
  UNIQUE KEY `course_id_UNIQUE` (`course_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8 COMMENT='Table for courses';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (28,'MVS01-S16','Fun with Violin - Starter (Summer Term 1)','','Francis Lau',56.00,0,1,'2016-05-07','2016-06-25',NULL,'Weekly','[\"English\", \"Cantonese\", \"Mandarin\"]','[{\"day\": \"Saturday\", \"end_time\": \"11 : 45 AM\", \"start_time\": \"11 : 00 AM\"}]',NULL,'Children, adults and seniors','An introductory class for all, to learn the basic techniques in playing this fine instrument. Participants will be taught fundamentals of the “5-lines score sheet”, and simple music theory. Before you know it you will be able to play popular melodies.  \n\nNOTE: All students will need their own instrument and music stand.','Francis Lau earned the Royal Conservatory of Music\'s Grade 8 Violin level and was a violinist at the Hong Kong Youth Orchestra. He is currently a member of the Scarborough Chinese Baptist Church Chamber Orchestra.  He also teaches at the York Region Yee Hong Active Seniors & Outreach Program.',''),(30,'MVS02-S16','Fun with Violin - Starter (Summer Term 2)','','Francis Lau',56.00,0,NULL,'2016-07-09','2016-08-27',NULL,'Weekly','[\"English\", \"Cantonese\", \"Mandarin\"]','[{\"day\": \"Saturday\", \"end_time\": \"11 : 45 AM\", \"start_time\": \"11 : 00 AM\"}]',NULL,'Children, adults and seniors','An introductory class for all, to learn the basic techniques in playing this fine instrument. Participants will be taught fundamentals of the “5-lines score sheet”, and simple music theory. Before you know it you will be able to play popular melodies.  \n','Francis Lau earned the Royal Conservatory of Music\'s Grade 8 Violin level and was a violinist at the Hong Kong Youth Orchestra. He is currently a member of the Scarborough Chinese Baptist Church Chamber Orchestra.  He also teaches at the York Region Yee Hong Active Seniors & Outreach Program.\n',''),(31,'MVB01-S16','Fun with Violin - Basic (Summer Term 1)','','Francis Lau',56.00,0,NULL,'2016-05-07','2016-06-25',NULL,'Weekly','[\"English\", \"Cantonese\", \"Mandarin\"]','[{\"day\": \"Saturday\", \"end_time\": \"11 : 00 AM\", \"start_time\": \"10 : 15 AM\"}]',NULL,'Children, adults and seniors','An introductory class for all, to learn the basic techniques in playing this fine instrument. Participants will be taught fundamentals of the “5-lines score sheet”, and simple music theory. Before you know it you will be able to play popular melodies.  \n','Francis Lau earned the Royal Conservatory of Music\'s Grade 8 Violin level and was a violinist at the Hong Kong Youth Orchestra. He is currently a member of the Scarborough Chinese Baptist Church Chamber Orchestra.  He also teaches at the York Region Yee Hong Active Seniors & Outreach Program.\n',''),(32,'MVB02-S16','Fun with Violin - Basic (Summer Term 2)','','Francis Lau',56.00,0,NULL,'2016-07-09','2016-08-27',NULL,'Weekly','[\"English\", \"Cantonese\", \"Mandarin\"]','[{\"day\": \"Saturday\", \"end_time\": \"11 : 00 AM\", \"start_time\": \"10 : 15 AM\"}]',NULL,'Children, adults and seniors','An introductory class for all, to learn the basic techniques in playing this fine instrument. Participants will be taught fundamentals of the “5-lines score sheet”, and simple music theory. Before you know it you will be able to play popular melodies.  \n','Francis Lau earned the Royal Conservatory of Music\'s Grade 8 Violin level and was a violinist at the Hong Kong Youth Orchestra. He is currently a member of the Scarborough Chinese Baptist Church Chamber Orchestra.  He also teaches at the York Region Yee Hong Active Seniors & Outreach Program.\n','');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-14 22:05:25