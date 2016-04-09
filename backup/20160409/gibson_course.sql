-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: gibson
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
  `payment_period_id` int(10) unsigned NOT NULL COMMENT 'foreign key to another table called payment period which ids each payment type',
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
  UNIQUE KEY `course_id_UNIQUE` (`course_id`),
  KEY `payment_period_idx` (`payment_period_id`),
  CONSTRAINT `payment_period` FOREIGN KEY (`payment_period_id`) REFERENCES `payment_period` (`payment_period_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=204 DEFAULT CHARSET=utf8 COMMENT='Table for courses';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'HW06JA-W16JA','空手道',NULL,NULL,30.00,NULL,1,'2016-04-20','2016-05-01','7:30PM - 9:00PM','Weekly',NULL,'[\"Maikelelele\", \"Friberg\", \"Xizt\", \"F0rest\", \"GeT_RiGhT\"]',NULL,'All Ages and Families','Language: English\n\r Exam Fee and other karate membership fee are not included, details will be announced during class',NULL,NULL),(2,'SBA-W16','Adult Basketball',NULL,NULL,7.00,NULL,2,'2016-04-20','2016-05-01','We: 4-6:30pm, Su:7-9:30pm','Weekly',NULL,NULL,NULL,'19 Years Old and above','Drop-in Adult basketball',NULL,NULL),(3,'MI01S01-W16','Fun with the Violin(Starter)',NULL,NULL,49.00,NULL,3,'2016-04-20','2016-05-01','10:30AM - 12:00PM','Weekly',NULL,NULL,NULL,'Children, Adults and Seniors','Language: Cantonese, Mandarin, English \nStudents will need to bring their own instruments and music stand',NULL,NULL),(4,'MI01I01-W16','Fun with the Violin(Intermediate)',NULL,NULL,49.00,NULL,3,'2016-04-20','2016-05-01','9:00 - 10:30AM','Weekly',NULL,NULL,NULL,'Children, Adults and Seniors','Language: Cantonese, Mandarin, English \nStudents will need to bring their own instruments and music stand',NULL,NULL),(5,'MI01201-W16','Fun with the Erhu',NULL,NULL,49.00,NULL,3,'2016-04-20','2016-05-01','12:00 - 1:00PM','Weekly',NULL,NULL,NULL,'Children, Adults and Seniors','Language: Cantonese, Mandarin, English \nStudents will need to bring their own instruments and music stand',NULL,NULL),(162,'AL3','ALLEN LEE\'s COURSE','','Allen LEE',123.00,999,1,'2016-04-17','2016-05-07',NULL,'Weekly','[\"ENGLISH\", \"JPN\"]','[{\"day\": \"Monday\", \"end_time\": \"02 : 15 : PM\", \"start_time\": \"02 : 15 : PM\"}, {\"day\": \"Tuesday\", \"end_time\": \"11 : 15 : PM\", \"start_time\": \"12 : 15 : PM\"}]',NULL,'kids','abcdwert','',''),(163,'jlkfdsa','maymays','','fdsaf',32.00,3421,1,'2016-04-01','2016-04-29',NULL,'Weekly','[\"jkfdlsjflk\"]','[{\"day\": \"Thursday\", \"end_time\": \"05 : 56 : PM\", \"start_time\": \"05 : 56 : PM\"}]',NULL,'fjdsklfa','fjdklsajfdlksa','fdsafdsa',''),(164,'LNL','LUCK & LOGIC','','Yoshichika',0.00,9323,1,'2016-04-01','2016-04-29',NULL,'Weekly','[\"English\", \"Japanese\"]','[{\"day\": \"Monday\", \"end_time\": \"06 : 00 : PM\", \"start_time\": \"06 : 00 : PM\"}, {\"day\": \"Tuesday\", \"end_time\": \"06 : 00 : PM\", \"start_time\": \"06 : 00 : PM\"}]',NULL,'Logicalists and Logicalist candidates','Fite sum foreigners :^)',':^):^):^)',''),(177,'ccc','course','huehuheu','Course McCourse',0.00,1,1,'2016-04-01','2016-04-22',NULL,'Weekly','[\"English\"]','[{\"day\": \"Thursday\", \"end_time\": \"06 : 57 : PM\", \"start_time\": \"06 : 56 : PM\"}]',NULL,'Benji Zhao',':)',':>',''),(178,'ccc','course','huehuheu','Course McCourse',0.00,1,1,'2016-04-01','2016-04-22',NULL,'Weekly','[\"English\"]','[{\"day\": \"Thursday\", \"end_time\": \"06 : 57 : PM\", \"start_time\": \"06 : 56 : PM\"}]',NULL,'Benji Zhao',':)',':>',''),(179,'fish','fish','picturesqued','vincent fan',3.00,1,1,'2016-04-01','2016-04-15',NULL,'Weekly','[\"fish\"]','[{\"day\": \"Wednesday\", \"end_time\": \"08 : 00 : PM\", \"start_time\": \"07 : 59 : PM\"}]',NULL,'hungry ppl','eat fish','will eat fish everyday',''),(180,'mcd','mcd','mcd','ronald mcdonald',1010.00,1010,1,'2016-04-01','2016-04-15',NULL,'Weekly','[\"1010\"]','[{\"day\": \"Friday\", \"end_time\": \"08 : 03 : PM\", \"start_time\": \"07 : 02 : PM\"}]',NULL,'employees','NOBODY GOES ON BREAK UNTIL THIS IS DONE','heeeey guys',''),(181,'fjdklsa','mlem','fdsa','fdsa',32.00,3213,1,'2016-04-08','2016-04-22',NULL,'Weekly','[\"efdsa\"]','[{\"day\": \"Thursday\", \"end_time\": \"08 : 05 : PM\", \"start_time\": \"08 : 04 : PM\"}]',NULL,'fdsa','fdfsa','sadfsa',''),(182,'qaf','faq','quacks','naf',0.00,9999,1,'2016-04-08','2016-04-29',NULL,'Weekly','[\"English\"]','[]',NULL,'all are welcome',':)','t\'quackniv',''),(187,'qaf','faq','quacks','naf',0.00,9999,1,'2016-04-08','2016-04-29',NULL,'Weekly','[\"English\"]','[]',NULL,'all are welcome',':)','t\'quackniv',''),(188,'noadhoc','No Adhoc','ff','Mozilla Firefox',12.00,21,1,'2016-04-01','2016-04-15',NULL,'Weekly','[\"JavaScript\"]','[{\"day\": \"Friday\", \"end_time\": \"11 : 33 : PM\", \"start_time\": \"10 : 32 : PM\"}, {\"day\": \"Saturday\", \"end_time\": \"11 : 33 : PM\", \"start_time\": \"10 : 33 : AM\"}]',NULL,'you',':^)',':)',''),(189,'nosched','No Scheduled','ff','Mozilla Firefox',12.00,21,1,'2016-04-01','2016-04-15',NULL,'Weekly','[\"JavaScript\"]','[]',NULL,'you',':^)',':)',''),(190,'nosched','No Scheduled','ff','Mozilla Firefox',12.00,21,1,'2016-04-01','2016-04-15',NULL,'Weekly','[\"JavaScript\"]','[]',NULL,'you',':^)',':)',''),(191,'1ea','1 each','ff','Mozilla Firefox',12.00,21,1,'2016-04-01','2016-05-06',NULL,'Weekly','[\"JavaScript\"]','[{\"day\": \"Friday\", \"end_time\": \"11 : 36 : PM\", \"start_time\": \"11 : 36 : AM\"}]',NULL,'you',':^)',':)',''),(192,'addc','addcourse','','Tachikaze',123.00,11,1,'2016-04-13','2016-04-28',NULL,'Weekly','[\"Language\", \"English\"]','[{\"day\": \"Monday\", \"end_time\": \"04 : 00 PM\", \"start_time\": \"12 : 00 PM\"}]',NULL,'Grade 9','Hello Wolrd','The great dinosaurs',''),(193,'addc','addcourse','','Tachikaze',123.00,11,1,'2016-04-13','2016-04-13',NULL,'Weekly','[\"Language\", \"English\"]','[{\"day\": \"Monday\", \"end_time\": \"04 : 00 PM\", \"start_time\": \"12 : 00 PM\"}]',NULL,'Grade 9','Hello Wolrd','The great dinosaurs',''),(194,'addc','addcourse','','Tachikaze',123.00,11,1,'2016-04-13','2016-04-13',NULL,'Weekly','[\"Language\", \"English\"]','[{\"day\": \"Wednesday\", \"end_time\": \"04 : 00 PM\", \"start_time\": \"12 : 00 PM\"}]',NULL,'Grade 9','Hello Wolrd','The great dinosaurs',''),(195,'addc','addcourse','','Tachikaze',123.00,11,1,'2016-04-13','2016-04-13',NULL,'Weekly','[\"Language\", \"English\"]','[{\"day\": \"Wednesday\", \"end_time\": \"04 : 00 PM\", \"start_time\": \"12 : 00 PM\"}, {\"day\": \"Monday\", \"end_time\": \"12 : 00 PM\", \"start_time\": \"12 : 00 PM\"}]',NULL,'Grade 9','Hello Wolrd','The great dinosaurs',''),(196,'addc','addcourse','','Tachikaze',123.00,11,1,'2016-04-13','2016-04-13',NULL,'Weekly','[\"Language\", \"English\"]','[{\"day\": \"Wednesday\", \"end_time\": \"04 : 00 PM\", \"start_time\": \"12 : 00 PM\"}, {\"day\": \"Monday\", \"end_time\": \"12 : 00 PM\", \"start_time\": \"12 : 00 PM\"}]',NULL,'Grade 9','Hello Wolrd','The great dinosaurs',''),(197,'wdt','who did this','remv','riueo',324.00,4322,1,'2016-04-02','2016-04-30',NULL,'Weekly','[\"WHODIDTHIS\"]','[{\"day\": \"Saturday\", \"end_time\": \"12 : 00 AM\", \"start_time\": \"01 : 00 PM\"}]',NULL,':(','fjdklsajflkdsajl','hre',''),(198,'allen2tall','OHHHHHHHHH','4332y','43242345',432.00,4365,1,'2016-04-01','2016-04-22',NULL,'Weekly','[\"lel\"]','[{\"day\": \"Saturday\", \"end_time\": \"11 : 00 PM\", \"start_time\": \"01 : 00 PM\"}]',NULL,'hooohooohoohooohoohoo','fdsf','hferewsf',''),(199,'R101','Route 101','employee','PokeMart',101.00,1,1,'2016-04-02','2016-04-30',NULL,'Weekly','[\"Pokemon\"]','[{\"day\": \"Saturday\", \"end_time\": \"01 : 00 PM\", \"start_time\": \"12 : 00 PM\"}]',NULL,'YOU TRAINER WITH ONLY 1 WIMPY POKEMON','GET A FREE POTION','THIS IS TOTALLY AN ADVERTISEMENT CAMPAIGN AND NOT AN ATTEMPT TO MOCK YOUR WEAK ASS',''),(200,'R101','Route 101','employee','PokeMart',101.00,1,1,'2016-04-02','2016-04-30',NULL,'Weekly','[\"Pokemon\"]','[{\"day\": \"Saturday\", \"end_time\": \"01 : 00 PM\", \"start_time\": \"12 : 00 PM\"}]',NULL,'YOU TRAINER WITH ONLY 1 WIMPY POKEMON','GET A FREE POTION','THIS IS TOTALLY AN ADVERTISEMENT CAMPAIGN AND NOT AN ATTEMPT TO MOCK YOUR WEAK ASS',''),(201,'BI','biweekly course','in','innuendo',2.00,2,1,'2016-04-02','2016-04-30',NULL,'Bi-weekly','[\"BI\"]','[{\"day\": \"Saturday\", \"end_time\": \"12 : 00 PM\", \"start_time\": \"11 : 00 PM\"}]',NULL,'two people',':) 8== D() (:',':^)',''),(202,'CLIP','what\'s clipboard?','WhyDoINeedThis','Allen Lee',0.00,9,1,'2016-04-01','2016-04-29',NULL,'Bi-weekly','[\"English\", \"Javascript\"]','[{\"day\": \"Friday\", \"end_time\": \"09 : 00 PM\", \"start_time\": \"01 : 00 PM\"}]',NULL,'devs','What is clipboard.js?','you\'re a cool kid did you know that',''),(203,'huehuehue','Mandatory Religion Mocking Session','NARWHAL','Snob-ass neckbeard',0.00,9999,1,'2016-04-02','2016-04-30',NULL,'Bi-weekly','[\"English\", \"Any language\"]','[{\"day\": \"Saturday\", \"end_time\": \"12 : 00 AM\", \"start_time\": \"11 : 00 PM\"}]',NULL,'Bad-mannered atheists',':)','bacons at midnight','');
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

-- Dump completed on 2016-04-09 19:14:30
