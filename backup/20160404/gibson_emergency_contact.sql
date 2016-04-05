-- MySQL dump 10.13  Distrib 5.7.9, for Win32 (AMD64)
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
-- Table structure for table `emergency_contact`
--

DROP TABLE IF EXISTS `emergency_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `emergency_contact` (
  `contact_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `lname` varchar(64) NOT NULL,
  `fname` varchar(64) NOT NULL,
  `relationship` varchar(64) NOT NULL,
  `contact_phone` varchar(16) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`contact_id`),
  UNIQUE KEY `contact_id_UNIQUE` (`contact_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `related_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COMMENT='Emergency contacts for each user - may have more than 1 per user';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_contact`
--

LOCK TABLES `emergency_contact` WRITE;
/*!40000 ALTER TABLE `emergency_contact` DISABLE KEYS */;
INSERT INTO `emergency_contact` VALUES (1,1,'Sagad','At','This','123','2016-03-03 06:09:20'),(2,1,'Sagad','At','This','123','2016-03-03 06:09:20'),(3,2,'q','q','q','q','2016-03-05 17:57:33'),(4,3,'eqweq','eqwe','eqw','ewq','2016-03-05 18:01:06'),(5,3,'eqwe','eqw','eqw','eqwe','2016-03-05 18:01:06'),(6,4,'sdvadc','gndfb','scsc','2222222222','2016-03-05 18:43:43'),(7,5,'q','q','q','q','2016-03-05 20:36:24'),(8,6,'Maki','Nishikino','Waifu','4163350823','2016-03-05 20:45:10'),(9,7,'Alice','Smith','mother','1111111111','2016-03-19 22:18:32'),(10,8,'Alice','Smith','sdfsas','1111111111','2016-03-19 23:26:23'),(11,9,'Alice','Smith','mother','1111111111','2016-03-19 23:48:37'),(12,10,'qwe','rty','asd','1231231234','2016-03-25 15:55:27'),(13,11,'tim','my','mom','123','2016-03-26 01:27:32'),(14,12,'Alice',' Smith','Science Student','1234567890','2016-04-03 20:54:56');
/*!40000 ALTER TABLE `emergency_contact` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-04 22:46:05
