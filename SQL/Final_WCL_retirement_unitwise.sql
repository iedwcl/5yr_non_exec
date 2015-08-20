SELECT dd.areaname AREA,
       dd.unitname UNIT,
       dd.unit UNITCODE,
       D.DISCP DISCIPLINE,
       SUBSTR( D.GDESIG, 0, 15 )  GDESIG,
       dd.dcd DCD,
       dd.tot TOT,
       dd.R15_16 R15_16,
       dd.R16_17 R16_17,
       dd.R17_18 R17_18,
       dd.R18_19 R18_19,
       dd.R19_20 R19_20,
       dd.R20_21 R20_21
  FROM ( 
    SELECT s.AREANAME areaname,
           s.name unitname,
           e.ucde unit,
           SUBSTR( DESG, 3, 5 )  dcd,
           COUNT( EIS )  TOT,
           sum( CASE
                WHEN date( DOB, '+60 years' )  BETWEEN date( '2015-04-01' )  AND date( '2016-03-31' )  THEN 1 
                ELSE 0 
           END )  AS R15_16,
           sum( CASE
                WHEN date( DOB, '+60 years' )  BETWEEN date( '2016-04-01' )  AND date( '2017-03-31' )  THEN 1 
                ELSE 0 
           END )  AS R16_17,
           sum( CASE
                WHEN date( DOB, '+60 years' )  BETWEEN date( '2017-04-01' )  AND date( '2018-03-31' )  THEN 1 
                ELSE 0 
           END )  AS R17_18,
           sum( CASE
                WHEN date( DOB, '+60 years' )  BETWEEN date( '2018-04-01' )  AND date( '2019-03-31' )  THEN 1 
                ELSE 0 
           END )  AS R18_19,
           sum( CASE
                WHEN date( DOB, '+60 years' )  BETWEEN date( '2019-04-01' )  AND date( '2020-03-31' )  THEN 1 
                ELSE 0 
           END )  AS R19_20,
           sum( CASE
                WHEN date( DOB, '+60 years' )  BETWEEN date( '2020-04-01' )  AND date( '2021-03-31' )  THEN 1 
                ELSE 0 
           END )  AS R20_21
      FROM EMPLOYEE e
           LEFT JOIN ( 
            SELECT a.area AREANAME,
                   d.code UNITCODE,
                   d.name name
              FROM AREA a
                   LEFT JOIN ( 
                        SELECT areacode,
                               code,
                               name
                          FROM UNIT u
                         GROUP BY code 
                    ) 
                    d
                          ON a.code = d.areacode 
        ) 
        s
                  ON e.ucde = s.UNITCODE
     WHERE e.emp_type = 'N' 
           AND
           e.inService = 'W' 
           AND
           e.isUpdated = 'Y'
     GROUP BY e.ucde,
              SUBSTR( DESG, 3, 5 ) 
) 
dd
       LEFT JOIN ( 
    SELECT SUBSTR( DSCD, 3, 5 )  D5,
           GDESIG,
           discp
      FROM DESG
     GROUP BY SUBSTR( DSCD, 3, 5 ) 
) 
D
              ON dd.dcd = D.D5
 GROUP BY dd.unit,
          dd.dcd;

