# Covid-19 Dashboard

*Brendan Fisher, Alexander Kim, Anna Le, Samantha Martinez*


## Overview and Description

This application will allow the user to visualize and analyze trends in COVID-19 case and national testing data. Through the web-based user interface, the application will allow for users to choose from a pool of data points and time frames to aid in the visualization of specific trends. 

Our application features two databases, one contains primarily demographic information about COVID cases and the other will contain quantitative data points about national testing data. This will be reflected in our user interface, which will offer two sets of trend analysis. Users will be able to cross reference the two sets of trend analysis to form a more accurate picture of the impact of Covid-19 in the U.S. 

## Database Motivation and User Interest

This application utilizes two datasets, focusing on demographic statistics and quantitative data about Coronavirus testing and individual cases of people with Coronavirus in the United States. There are multiple benefits to having a database support for this application, including: data consistency, data integrity, and a reduction in data redundancy. This application uses two large datasets that depending on the user-defined queries need to be sorted, searched, and extracted. The user has a variety of options to filter the data, which will compile a graph that represents their query or queries, which demonstrates the benefit of complex trend queries in this application. Having database support assures that there will be data consistency, ensuring that all data viewed by users is the same.  The data integrity is essential to provide users with an accurate graphical output of the queries they desire to view, also relying on the consistency. Without a database, the data can accidentally become redundant due to multiple entries of the same files.  
The users of this application will most likely be individuals who are interested in analyzing the effects of Coronavirus in the United states, as well as individuals who reside in the United States and would like to monitor the effects of the pandemic in their region. This application would benefit these users with an easy and efficient way to sort through the datasets, and filter which trend queries are most relevant to them.

## User Interface Description

Our application will feature two sets of information to be analyzed. One set will represent primarily demographic information and trends in COVID cases while the other will present primarily quantitative information in regards to testing results, case status, etc. 

On the quantitative side, the user will first select a range of dates to be analyzed. The user will then be able to select either a state or a complex trend to be displayed from a drop down list. These complex trends will be complex queries that we have come up with to display trends in the dataset. By allowing the user to select either the state or the trend, we can then filter the available data based on the user selection. For example, if the user were to pick the trend representing the average number of hospitalized cases per month, the selection of states available for the user to analyze would then be reduced to only the states that report information that can be used to calculate this information, and vice versa, if the user chooses for example Florida to analyze, only data that Florida reports would be available for analysis. 

For demographic trends, the user will first select a range of dates to be analyzed. The user will then be able to select from a series of complex trends that we have come up with. They will then be able to make selections to filter these trends by various demographic characteristics, such as age, sex, race, etc.

## Trend Analysis Goals

The goal of this application in regards to trend analysis is to allow the user to view COVID-19 case and testing status over time throughout the United States. Through the combination of two data sources, we hope to provide both demographic data and quantitative data that can be cross referenced to allow the user to view various trends. We plan to analyze the movement of testing results as well as case status over a period of time with the ability to filter by several demographic characteristics in an effort to display the impact and development of COVID in the United States.  

## Data Sources

[COVID-19 Case Surveillance Public Use Data](https://data.cdc.gov/Case-Surveillance/COVID-19-Case-Surveillance-Public-Use-Data/vbim-akqf)
- Contains individual report data of more than 18 million cases, including demographic data such as age, race, sex as well as case data such as the report date, symptom onset date, hospitalization status, etc. Useful for demographic analyses of cases however data does not contain information about every case reported as this is in a separate restricted access database. 

[The COVID Tracking Project](https://covidtracking.com/data)
- Contains quantitative data for every test, negative or positive, and confirmed case in all states and territories of the US since mid-March 2020. Data points include number of deaths, number of hospitalized/ICU, number of positive/negative tests, etc for every day and every state. One weakness of the dataset is that not every state reports the same data, so some data points may not be retrievable for every state.

## Example Trend Queries

What is the average age of patients hospitalized per positive test in a given month in one state?
- To view this trend, the total number of positive reports in the given month will be compared to the number of patients hospitalized (by covid-19) in the same month. In the given month of one state, the sum of positive patients hospitalized will be divided by the total number of positive tests to find the average.

What is the average number of positive/negative test results per month either for a single state, series of states, or the entire nation?
- First we will gather the data represented by the state/states in question. We will then calculate the difference in cumulative positive/negative tests for the states from the beginning to the end of the month. This difference represents the number of new positive/negative test results for that month and it will be plotted on a line graph to represent the change in test results over time.
 
How has the ratio of viral positive tests to positive tests changed over time for a single state?
- This trend will be computed by grouping the day-to-day reportings of a single state into blocks for each month. The number of positive and viral positive cases will then be summed and divided and this value will be assigned to a new result relation and paired with the month it represents. This process will be repeated for each month and this trend will be displayed on a line graph representing the ratio change over time.  

What is the average number of positive cases per race/ethnicity group in a month?
- To calculate the information for this trend, the different races/ethnicities would need to be gathered. Once this is obtained, the collective number of individuals who tested positive must be counted and then sorted by the number of positive cases within each respective group. The average would be calculated by taking the different total sums and then dividing by the total number of positive individuals in that month. The data could then be represented through a bar graph, allowing the observations to be compared.

What are the death toll averages for a particular age group of individuals who tested positive, during a certain period of time?
- To process this trend, the age group or groups would be selected and sorted. Once the age groups that correspond to the query are sorted, it would then sort the members of that age group by those that tested positive and have died. This process will occur again for the requested dates. Once this information has been obtained, the members of the specified age group who tested positive and died will be totalled and averaged between the period of time selected. The data would then be represented through a bar graph.

## Intended Use of Software

The application will involve the use of React to develop the frontend, as well as CSS to style these different React components. To communicate with the SQL database, Express will be used. This would include the use of axios calls to send and request data. In addition to Express, our application plans on incorporating Node.js. 
