Sub vba_wall_street()

' Created loop for running the code on each worksheet

For Each ws In Worksheets

'-------------------------------------------------------------------------
'First part - Summary table with stock ticker and Total volume
'-------------------------------------------------------------------------
    
    'Inserted headers to the cells
    
    ws.Range("I1").Value = "Ticker"
    ws.Range("J1").Value = "Yearly Change"
    ws.Range("K1").Value = "Percent Change"
    ws.Range("L1").Value = "Total Stock Volume"

   'Defined initial variables
    
    Dim ticker_name As String
    Dim total_volume As Double
     
    'Set the total volume variable to zero
    total_volume = 0
    
    'Defined a counter for rows in summary table and initialized it to 2 (first row of values)
    
    Dim summary_count As Integer
    summary_count = 2
    
    'Calculated last row in the data on the worksheet
    last_row = ws.Cells(Rows.Count, 1).End(xlUp).Row
    
    'loop to identify unique values of tickers and calculate total volume
    
    For i = 2 To last_row
    
        If ws.Cells(i + 1, 1).Value <> ws.Cells(i, 1).Value Then
        
            ticker_name = ws.Cells(i, 1).Value
            total_volume = total_volume + ws.Cells(i, "G").Value
                
            'Print ticker and total volume in summary table
            ws.Range("I" & summary_count).Value = ticker_name
            ws.Range("L" & summary_count).Value = total_volume
            
            summary_count = summary_count + 1
            total_volume = 0
        
        Else
            total_volume = total_volume + ws.Cells(i, "G").Value
        
        End If
    Next i
    
    'Set the number format of percent_change row to percentage
    ws.Range("K2:K" & last_row).NumberFormat = "0.00%"
          
    '----------------------------------------------------------------
    'Second part - Calculating yearly change and % change
    '----------------------------------------------------------------
    
    'Defined variables
    Dim opening_value As Double
    Dim closing_value As Double
    
    Dim yearly_change As Double
    Dim percent_change As Double
        
    'Initialized summary counter to 2 again
    summary_count = 2
    
    'opening value for first stock in the data
    opening_value = ws.Range("C2").Value
    
    'loop for finding yearly change and % change
    For i = 3 To last_row
    
        'closing and next opening values found at the change in ticker
        If (ws.Cells(i, 1).Value <> ws.Cells(i + 1, 1).Value) Then
        
            closing_value = ws.Cells(i, 6).Value
            yearly_change = closing_value - opening_value
            
            ' if statement to avoid Divide by 0 error
            If opening_value <> 0 Then
            
                percent_change = yearly_change / opening_value
            Else
                percent_change = 0
            End If
            
            ws.Range("J" & summary_count).Value = yearly_change
            ws.Range("K" & summary_count).Value = percent_change
            
            'conditional formatting for red and green
            If yearly_change >= 0 Then
                ws.Range("J" & summary_count).Interior.ColorIndex = 4
            Else
                ws.Range("J" & summary_count).Interior.ColorIndex = 3
            End If
            
            summary_count = summary_count + 1       'by end it will be first empty row in summay table
            
            min_opening = ws.Cells(i + 1, 3).Value
        
        End If
    Next i
        
'-------------------------------------------------------------------------------------------------------------------
'Third part - Finding greatest percent increase, greatest percent decrease, and greatest total volume in the worksheet
'-------------------------------------------------------------------------------------------------------------------

    Dim g_percent_increase As Double
    Dim g_percent_decrease As Double
    Dim g_total_volume As Double
        
    Dim ticker_per_inc As String
    Dim ticker_per_dec As String
    Dim ticker_total_vol As String
    
    'Added headers
    ws.Range("P1").Value = "Ticker"
    ws.Range("Q1").Value = "Value"
    ws.Range("O2").Value = "Greatest % Increase"
    ws.Range("O3").Value = "Greatest % Decrease"
    ws.Range("O4").Value = "Greatest Total Volume"
    
    'initialized the variables to value from first row
    g_percent_increase = ws.Range("K2").Value
    g_percent_decrease = g_percent_increase
    g_total_volume = ws.Range("L2").Value
    
    For i = 3 To (summary_count - 1)
        If ws.Cells(i, 11).Value > g_percent_increase Then  'for greatest % increase
        
            g_percent_increase = ws.Cells(i, 11).Value
            ticker_per_inc = ws.Cells(i, 9).Value
           
        ElseIf ws.Cells(i, 11).Value < g_percent_decrease Then  'for greatest % decrease
        
            g_percent_decrease = ws.Cells(i, 11).Value
            ticker_per_dec = ws.Cells(i, 9).Value
            
        End If
        
        If ws.Cells(i, 12).Value > g_total_volume Then  'for greatest total volume
        
            g_total_volume = ws.Cells(i, 12).Value
            ticker_total_vol = ws.Cells(i, 9).Value
            
        End If
    
    Next i
    
    'Printing the final value
    
    ws.Range("P2").Value = ticker_per_inc
    ws.Range("Q2").Value = g_percent_increase
    
    ws.Range("P3").Value = ticker_per_dec
    ws.Range("Q3").Value = g_percent_decrease
    
    ws.Range("P4").Value = ticker_total_vol
    ws.Range("Q4").Value = g_total_volume
    
    'final formatting
    
    ws.Range("Q2:Q3").NumberFormat = "0.00%"
    ws.Range("J1:Q4").Columns.AutoFit

Next ws

End Sub


