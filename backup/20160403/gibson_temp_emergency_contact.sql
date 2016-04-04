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
-- Table structure for table `temp_emergency_contact`
--

DROP TABLE IF EXISTS `temp_emergency_contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `temp_emergency_contact` (
  `contact_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `lname` varchar(64) NOT NULL,
  `fname` varchar(64) NOT NULL,
  `relationship` varchar(64) NOT NULL,
  `contact_phone` varchar(16) NOT NULL,
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`contact_id`),
  UNIQUE KEY `contact_id_UNIQUE` (`contact_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8 COMMENT='Emergency contacts for each user - may have more than 1 per user';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temp_emergency_contact`
--

LOCK TABLES `temp_emergency_contact` WRITE;
/*!40000 ALTER TABLE `temp_emergency_contact` DISABLE KEYS */;
INSERT INTO `temp_emergency_contact` VALUES (1,1,'Sagad','At','This','123','2016-03-03 06:09:20'),(2,1,'Sagad','At','This','123','2016-03-03 06:09:20'),(3,2,'q','q','q','q','2016-03-05 17:57:33'),(4,3,'eqweq','eqwe','eqw','ewq','2016-03-05 18:01:06'),(5,3,'eqwe','eqw','eqw','eqwe','2016-03-05 18:01:06'),(6,4,'Alice','Smith','mother','1111111111','2016-03-05 18:28:13'),(7,5,'bob','lee','uncle','1231231234','2016-03-05 18:37:25'),(8,6,'sdvadc','gndfb','scsc','2222222222','2016-03-05 18:43:43'),(9,7,'lkjxialwk','zxhushwdwjk','xclixkw','3333333333','2016-03-05 18:52:45'),(10,8,'q','q','q','q','2016-03-05 20:36:24'),(11,9,'Maki','Nishikino','Waifu','4163350823','2016-03-05 20:45:10'),(12,10,'q','q','q','q','2016-03-05 20:54:29'),(13,11,'q','q','q','q','2016-03-05 20:54:40'),(14,12,'q','q','q','q','2016-03-05 20:54:51'),(15,13,'q','q','q','q','2016-03-05 20:55:08'),(16,14,'q','q','qe','q','2016-03-05 20:56:09'),(17,15,'zuhu','cufsif','xjcksuu','22222222222','2016-03-05 21:01:07'),(18,16,'Alice','Smith','mother','1111111111','2016-03-19 19:11:00'),(19,17,'alice','smith','mother','1111111111','2016-03-19 19:15:46'),(20,18,'Alice','Smith','mother','1111111111','2016-03-19 19:20:09'),(21,19,'Alice','Smith','qwe123','1111111111','2016-03-19 19:28:04'),(22,20,'Alice','Smith','mother','1111111111','2016-03-19 19:31:07'),(23,21,'Alice','Smith','qwe123','1111111111','2016-03-19 19:44:02'),(24,22,'Alice','Smith','mother','1111111111','2016-03-19 19:47:06'),(25,23,'Alice','Smith','mother','1111111111','2016-03-19 19:50:21'),(26,24,'Alice','Smith','mother','1111111111','2016-03-19 20:14:11'),(27,25,'Alice','Smith','mother','1111111111','2016-03-19 20:32:39'),(28,26,'Alice','Smith','mother','1111111111','2016-03-19 20:39:23'),(29,27,'Alice','Smith','mother','1111111111','2016-03-19 20:42:41'),(30,28,'Alice','Smith','mother','1111111111','2016-03-19 20:49:02'),(31,29,'Alice','Smith','mother','1111111111','2016-03-19 21:03:22'),(32,30,'Alice','Smith','mother','1111111111','2016-03-19 21:29:15'),(33,31,'Alice','Smith','mother','1111111111','2016-03-19 21:42:30'),(34,32,'Alice','Smith','mother','1111111111','2016-03-19 21:44:54'),(35,33,'Alice','Smith','mother','1111111111','2016-03-19 21:46:39'),(36,34,'Alice','Smith','mother','1111111111','2016-03-19 21:48:27'),(37,35,'bobby','lee','uncle','1231231234','2016-03-19 21:53:35'),(38,36,'Alice','Smith','mother','1111111111','2016-03-19 21:56:12'),(39,37,'Alice','Smith','mother','1111111111','2016-03-19 22:00:21'),(40,38,'Alice','Smith','mother','1111111111','2016-03-19 22:04:56'),(41,40,'Alice','Smith','mother','1111111111','2016-03-19 22:12:39'),(42,42,'Alice','Smith','mother','1111111111','2016-03-19 22:18:32'),(43,43,'Alice','Smith','mother','1111111111','2016-03-19 22:30:11'),(44,44,'Alice','Smith','mother','1111111111','2016-03-19 22:41:00'),(45,45,'Alice','Smith','mother','1111111111','2016-03-19 22:44:53'),(46,46,'Alice','Smith','mother','1111111111','2016-03-19 23:07:46'),(47,47,'Alice','Smith','fds','1111111111','2016-03-19 23:10:07'),(48,48,'Alice','Smith','fhdg','1111111111','2016-03-19 23:13:26'),(49,49,'Alice','Smith','sdfsas','1111111111','2016-03-19 23:26:23'),(50,50,'Alice','Smith','mother','1111111111','2016-03-19 23:48:37'),(51,51,'qwe','rty','asd','1231231234','2016-03-25 15:55:27'),(52,52,'tim','my','mom','123','2016-03-26 01:27:32'),(53,53,'Alice',' Smith','Science Student','1234567890','2016-04-03 20:54:56');
/*!40000 ALTER TABLE `temp_emergency_contact` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-03 18:35:55
