SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
​
--
-- Database: `database`
--
​
-- --------------------------------------------------------
​
--
-- Table structure for table `registration`
--
USE stiff_money​

CREATE TABLE 'registration' (
  'Full Name' varchar(255) NOT NULL,
  'Phone Number' int(255) NOT NULL,
  'Current Monthly Income' int(255) NOT NULL,
  'Income Length' int(255) NOT NULL,
  'Current Address' int(255) NOT NULL,
  'Current Monthly Rent' int(255) NOT NULL,
  'How Months Paid Rent' int(255) NOT NULL,
  'Loans Have' varchar(255) NOT NULL,
  'FICO' varchar(255) NOT NULL,
  'Password' varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
COMMIT;
​
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

INSERT INTO 
  registration('full name', 'phone number', 'Current Monthly Income', 'Income Length', 'Current Address', 'Current Monthly Rent', 'How Months Paid Rent', 'Loans Have', 'FICO', 'Password')
VALUES
  ('Ken', 666, 100, 123, 12, 'House', 'dsdsd', 'abc');