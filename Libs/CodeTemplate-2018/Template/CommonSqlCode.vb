Imports CodeSmith.Engine
Imports SchemaExplorer
Imports System
Imports System.Collections
Imports System.ComponentModel
Imports System.Data
Imports System.Data.SqlClient
Imports System.Text
Imports System.Text.RegularExpressions
Imports System.IO
Imports System.Diagnostics

Namespace Templates
    ''' <summary>
    '''      Common code-behind class used to simplify SQL Server based CodeSmith templates
    ''' </summary>
    Public Class CommonSqlCode
        Inherits CodeTemplate
        
#Region "Enum"
            Public Enum DbmsTypeEnum
                SqlServer
                Oracle
                MySql
                Access
            End Enum
#End Region

        '[ab 012605] convenience array for checking if a datatype is an integer 
        Private Shared ReadOnly aIntegerDbTypes() As DbType = New DbType() {DbType.Int16, DbType.Int32, DbType.Int64}

        ''' <summary>
        '''      Return a specified number of tabs
        ''' </summary>
        ''' <param name="n" type="Int32">
        '''     <para>
        '''         Number of tabs
        '''     </para>
        ''' </param>
        ''' <returns>
        '''      n tabs
        ''' </returns>
        Public Function Tab(ByVal n As Integer) As String
            Return New String("\t", n)
        End Function


        Public Function GetSafeName(ByVal schemaObject As SchemaObjectBase) As String
            Return GetSafeName(schemaObject.Name)
        End Function

        Public Function GetSafeName(ByVal objectName As String) As String
            If objectName.IndexOfAny(New Char() {" ", "@", "-", ",", "!"}) > -1 Then
                Return "[" & objectName & "]"
            Else
                Return objectName
            End If
        End Function

        Public Function GetCamelCaseName(ByVal name As String) As String
            If name.Equals(name.ToUpper()) Then
                Return name.ToLower()
            Else
                Return name.Substring(0, 1).ToLower() + name.Substring(1)
            End If
        End Function

        Public Function GetPascalCaseName(ByVal name As String) As String
            Return name.Substring(0, 1).ToUpper() + name.Substring(1)
        End Function

        Public Function GetCleanName(ByVal schemaObject As SchemaObjectBase) As String
            Return GetCleanName(schemaObject.Name)
        End Function
        
        'Add on 26/06/2012 to seperate prefix class name for each dbms
        Public Function GetPrefixDbmsClassName(Byval dbmsType As DbmsTypeEnum) As String
        Dim strPrefix as string = "Sql"
        
            Select Case dbmsType
                Case DbmsTypeEnum.Oracle
                    strPrefix = "Oracle"
            End Select
            
            return strPrefix
        End Function
        
        Public Function GetPrefixProcedureParameter(Byval dbmsType as DbmsTypeEnum) As String
            Dim strPrefix as string = "@"
        
            Select Case dbmsType
                Case DbmsTypeEnum.Oracle
                    strPrefix = "v_"
            End Select
            
            return strPrefix
        End Function 

#Region "Business object class name"
        Public Function GetAbstractClassName(ByVal tableName As String) As String
            Return String.Format("{0}Base", GetClassName(tableName))
        End Function

        Public Function GetPartialClassName(ByVal tableName As String) As String
            Return String.Format("{0}.generated", GetClassName(tableName))
        End Function

        Public Function GetEnumName(ByVal tableName As String) As String
            Return String.Format("{0}", GetClassName(tableName).Replace("Enum", ""))
        End Function

        Public Function GetClassName(ByVal tableName As String) As String
            ' 1.remove space or bad characters
            Dim name As String = GetCleanName(tableName)

            ' 2. Set Pascal case
            name = GetPascalCaseName(name)

            ' 3. Remove any plural - Experimental, need more grammar analysis//ref: http://www.gsu.edu/~wwwesl/egw/crump.htm
            Dim invariants As ArrayList = New ArrayList
            invariants.Add("alias")


            If invariants.Contains(name.ToLower()) Then
                Return name
            ElseIf name.EndsWith("ies") Then
                Return name.Substring(0, name.Length - 3) & "y"
            ElseIf name.EndsWith("s") AndAlso Not (name.EndsWith("ss") OrElse name.EndsWith("us")) Then
                Return name.Substring(0, name.Length - 1)
            Else
                Return name
            End If

        End Function
#End Region

#Region "collection class name"
        Public Function GetAbstractCollectionClassName(ByVal tableName As String) As String
            Return String.Format("{0}Base", GetCollectionClassName(tableName))
        End Function

        Public Function GetCollectionClassName(ByVal tableName As String) As String
            Return String.Format("{0}Collection", GetClassName(tableName))
        End Function
#End Region

#Region "Factory class name"
        Public Function GetAbstractRepositoryClassName(ByVal tableName As String) As String
            Return String.Format("{0}Base", GetRepositoryClassName(tableName))
        End Function

        Public Function GetRepositoryClassName(ByVal tableName As String) As String
            Return String.Format("{0}Repository", GetClassName(tableName))
        End Function

        Public Function GetRepositoryInterfaceName(ByVal tableName As String) As String
            Return String.Format("I{0}Repository", GetClassName(tableName))
        End Function

        Public Function GetRepositoryTestClassName(ByVal tableName As String) As String
            Return String.Format("{0}RepositoryTest", GetClassName(tableName))
        End Function
#End Region

        Public Function GetCleanName(ByVal name As String) As String
            Return Regex.Replace(name, "[\W]", "")
        End Function

        Public Function GetManyToManyName(ByVal table1 As String, ByVal table2 As String) As String
            Dim manyToManyTableSeperator As String = "_From_"
            Return String.Format("{1}{0}{2}", manyToManyTableSeperator, GetClassName(table1), GetClassName(table2))
        End Function

        Public Function GetCleanParName(ByVal par As ParameterSchema) As String
            Return GetCleanParName(par.Name)
        End Function

        Public Function GetCleanParName(ByVal name As String) As String
            Return GetCamelCaseName(GetCleanName(name))
        End Function

        Public Function GetMemberVariableName(ByVal name As String) As String
            Return "_" & GetCleanParName(name)
        End Function

        Public Function GetColumnSqlComment(ByVal schemaObject As SchemaObjectBase) As String
            If schemaObject.Description.Length > 0 Then
                Return "-- " & schemaObject.Description
            Else
                Return ""
            End If
        End Function

		Public Function IsColumnFindable(ByVal column As ColumnSchema) As Boolean
			If column.DataType = DbType.Binary Or column.NativeType = "text" Or _
					column.NativeType = "ntext" Or _
					column.NativeType = "timestamp" or _
					column.NativeType = "image" Then
				
				Return False
			End If
 
			Return True
		End Function

		Public Function IsColumnFindable(ByVal column As ViewColumnSchema) As Boolean
			If column.DataType = DbType.Binary Or column.NativeType = "text" Or _
					column.NativeType = "ntext" Or _
					column.NativeType = "timestamp" or _
					column.NativeType = "image" Then
				
				Return False
			End If
 
			Return True
		End Function
		
		Public Function IsGetAnyColumn(ByVal column As ColumnSchema) As Boolean
			If column.DataType = DbType.Binary Or column.NativeType = "text" Or _
					column.NativeType = "ntext" Or _
					column.NativeType = "timestamp" or _
					column.NativeType = "image" or _
					column.name = "CREATE_DATE" or _
					column.name = "CREATE_USER" or _
					column.name = "UPDATE_DATE" or _
					column.name = "UPDATE_USER" Then
				
				Return False
			End If
 
			Return True
		End Function

		Public Function IsGetAnyColumn(ByVal column As ViewColumnSchema) As Boolean
			If column.DataType = DbType.Binary Or column.NativeType = "text" Or _
					column.NativeType = "ntext" Or _
					column.NativeType = "timestamp" or _
					column.NativeType = "image" or _
					column.name = "CREATE_DATE" or _
					column.name = "CREATE_USER" or _
					column.name = "UPDATE_DATE" or _
					column.name = "UPDATE_USER" Then
				
				Return False
			End If
 
			Return True
		End Function

				
        Public Function IsIdentityColumn(ByVal column As ColumnSchema) As Boolean
            Return CBool(column.ExtendedProperties("CS_IsIdentity").Value)
        End Function
        
        '''IsIdentityColumn with specify dbmsType
        Public Function IsIdentityColumn(ByVal column As ColumnSchema,Byval identityColumn as string,Byval dbmsType as DbmsTypeEnum) As Boolean
            If dbmsType = DbmsTypeEnum.Oracle Then
                IF identityColumn = column.Name Then 
                    Return True
                Else 
                    Return false 
                End If
            Else 
                Return CBool(column.ExtendedProperties("CS_IsIdentity").Value)
            End If 
        End Function

        Public Function IsReadOnlyColumn(ByVal column As ColumnSchema) As Boolean
            Return CBool(column.ExtendedProperties("CS_ReadOnly").Value)
        End Function
        


        Public Function GetOwner(ByVal table As TableSchema) As String
            If (table.Owner.Length > 0) Then
                Return GetSafeName(table.Owner) & "."
            Else
                Return ""
            End If
        End Function

        Public Function GetOwner(ByVal command As CommandSchema) As String
            If (command.Owner.Length > 0) Then
                Return GetSafeName(command.Owner) & "."
            Else
                Return ""
            End If
        End Function
		
		Public Function GetOwner(ByVal schema As SchemaObjectBase) As String		
			select case schema.GetType.Name.tolower
				case "tableschema"
					dim tb as TableSchema = schema
					If (tb.Owner.Length > 0) Then
						Return GetSafeName(tb.Owner) & "."
					Else
						Return ""
					End If
				case "viewschema"
					dim view as ViewSchema = schema
					If (view.Owner.Length > 0) Then
						Return GetSafeName(view.Owner) & "."
					Else
						Return ""
					End If
				case "commandschema"
					dim comm as CommandSchema = schema
					If (comm.Owner.Length > 0) Then
						Return GetSafeName(comm.Owner) & "."
					Else
						Return ""
					End If
					return ""
				case else 
					return ""
			end select
		End Function

		Public Function HasResultset(ByVal cmd As CommandSchema) As Boolean
            Return cmd.CommandResults.Count > 0
        End Function

        Public Function GetSqlParameterStatement(ByVal column As ColumnSchema) As String
            Return GetSqlParameterStatement(column, False)
        End Function

        Public Function GetSqlParameterStatement(ByVal column As ViewColumnSchema) As String
            Return GetSqlParameterStatement(column, False)
        End Function

		Public Function GetSqlParameterStatement(ByVal column As ColumnSchema, ByVal isOutput As Boolean) As String
            Dim param As String = "@" & column.Name & " " & column.NativeType

            Select Case column.DataType
                Case DbType.Decimal
                    If column.NativeType <> "real" Then
                        param &= "(" & column.Precision & ", " & column.Scale & ")"
                    End If

                    Exit Select
                Case DbType.AnsiString, DbType.AnsiStringFixedLength, DbType.String, DbType.StringFixedLength
                    If column.NativeType <> "text" AndAlso column.NativeType <> "ntext" Then
                        If column.Size > 0 Then
                            param &= "(" & column.Size & ")"
                        End If
                    End If
                    Exit Select
				Case DbType.Binary
					'param &= "(" & column.Size & ")"
					Exit Select
            End Select


            If isOutput Then
                param &= " OUTPUT"
            End If

            Return param
        End Function

        Public Function GetSqlParameterStatement(ByVal column As ViewColumnSchema, ByVal isOutput As Boolean) As String
            Dim param As String = "@" & column.Name & " " & column.NativeType

            Select Case column.DataType
                Case DbType.Decimal
                    If column.NativeType <> "real" Then
                        param &= "(" & column.Precision & ", " & column.Scale & ")"
                    End If

                    Exit Select
                Case DbType.AnsiString, DbType.AnsiStringFixedLength, DbType.String, DbType.StringFixedLength
                    If column.NativeType <> "text" AndAlso column.NativeType <> "ntext" Then
                        If column.Size > 0 Then
                            param &= "(" & column.Size & ")"
                        End If
                    End If
                    Exit Select
            End Select

            If isOutput Then
                param &= " OUTPUT"
            End If

            Return param
        End Function

		Public Function GetSqlParameterStatement(ByVal column As ColumnSchema, ByVal Name As String) As String
            Dim param As String = "@" & Name & " " & column.NativeType

            Select Case column.DataType
                Case DbType.Decimal
                    param &= "(" & column.Precision & ", " & column.Scale & ")"
                    Exit Select
                Case DbType.AnsiString, DbType.AnsiStringFixedLength, DbType.String, DbType.StringFixedLength
                    If column.NativeType <> "text" AndAlso column.NativeType <> "ntext" Then
                        If column.Size > 0 Then
                            param &= "(" & column.Size & ")"
                        End If
                    End If
                    Exit Select
            End Select
            Return param
        End Function
        
		Public Function GetSqlParameterStatement(ByVal column As ViewColumnSchema, ByVal Name As String) As String
            Dim param As String = "@" & Name & " " & column.NativeType

            Select Case column.DataType
                Case DbType.Decimal
                    param &= "(" & column.Precision & ", " & column.Scale & ")"
                    Exit Select
                Case DbType.AnsiString, DbType.AnsiStringFixedLength, DbType.String, DbType.StringFixedLength
                    If column.NativeType <> "text" AndAlso column.NativeType <> "ntext" Then
                        If column.Size > 0 Then
                            param &= "(" & column.Size & ")"
                        End If
                    End If
                    Exit Select
            End Select
            Return param
        End Function

        Public Function GetSqlProcedureComment(ByVal commandText As String) As String
            Dim comment As String = ""
            ' Find anything upto the CREATE PROC statement
            Dim regex As Regex = New Regex("CREATE[\s]*PROC", RegexOptions.IgnoreCase)

            comment = regex.Split(commandText)(0)
            'remove comment characters
            regex = New Regex("(-{2,})|(/\*)|(\*/)")
            comment = regex.Replace(comment, String.Empty)
            'trim and return
            Return comment.Trim()
        End Function

        Public Function GetSqlParameterComments(ByVal commandText As String) As Hashtable
            Dim paramComments As Hashtable = New Hashtable
            'Get parameter names and comments
            Dim pattern As String = "(?<param>@\w*)[^@]*--(?<comment>.*)"
            'loop through the matches and extract the parameter and the comment, ignoring duplicates
            For Each match As Match In Regex.Matches(commandText, pattern)
                If (Not paramComments.ContainsKey(match.Groups("param").Value)) Then
                    paramComments.Add(match.Groups("param").Value, match.Groups("comment").Value.Trim())
                End If
            Next match
            'return the hashtable
            Return paramComments
        End Function

#Region "Stored procedures input transformations"
        Public Function TransformStoredProcedureInputsToMethod(ByVal inputParameters As ParameterSchemaCollection) As String
            Return TransformStoredProcedureInputsToMethod(False, inputParameters)
        End Function

        Public Function TransformStoredProcedureInputsToMethod(ByVal startWithComa As Boolean, ByVal inputParameters As ParameterSchemaCollection) As String
            Dim temp As String = String.Empty
            Dim i As Integer = 0
            'ORIGINAL LINE: for(int i=0; i<inputParameters.Count; i += 1)
            'INSTANT VB NOTE: This 'for' loop was translated to a VB 'Do While' loop:
            Do While i < inputParameters.Count
                If (i > 0) OrElse startWithComa Then
                    temp &= ", "
                Else
                    temp &= ""
                End If
                temp &= GetCSType(inputParameters(i)) & " " & inputParameters(i).Name.Substring(1, inputParameters(i).Name.Length - 1)
                i += 1
            Loop

            Return temp
        End Function

        Public Function TransformStoredProcedureInputsToDataAccess(ByVal inputParameters As ParameterSchemaCollection) As String
            Return TransformStoredProcedureInputsToDataAccess(False, inputParameters)
        End Function

        Public Function TransformStoredProcedureInputsToDataAccess(ByVal alwaysStartWithaComa As Boolean, ByVal inputParameters As ParameterSchemaCollection) As String
            Dim temp As String = String.Empty
            Dim i As Integer = 0
            'ORIGINAL LINE: for(int i=0; i<inputParameters.Count; i += 1)
            'INSTANT VB NOTE: This 'for' loop was translated to a VB 'Do While' loop:
            Do While i < inputParameters.Count
                If (i > 0) OrElse alwaysStartWithaComa Then
                    temp &= ", "
                Else
                    temp &= ""
                End If
                temp &= inputParameters(i).Name.Substring(1, inputParameters(i).Name.Length - 1)
                i += 1
            Loop

            Return temp
        End Function

        Public Function TransformStoredProcedureInputsToMethodComments(ByVal inputParameters As ParameterSchemaCollection) As String
            Dim temp As String = String.Empty
            Dim i As Integer = 0
            'ORIGINAL LINE: for(int i=0; i<inputParameters.Count; i += 1)
            'INSTANT VB NOTE: This 'for' loop was translated to a VB 'Do While' loop:
            Do While i < inputParameters.Count
                temp &= String.Format("{2}" & "     " & "' <param name=""{0}""> A <c>{1}</c> instance.</param>", inputParameters(i).Name.Substring(1, inputParameters(i).Name.Length - 1), GetCSType(inputParameters(i)), Environment.NewLine)
                i += 1
            Loop

            Return temp
        End Function

#End Region

		Public Function GetCSharpDataType(ByVal field As DataObjectBase) As String
			Dim dataType As String = field.SystemType.ToString().ToLower().Replace("system.","")
			
            'Return field.NativeType.ToString() &"-" & field.Precision.ToString() & "-" & field.Scale.ToString()
            
			Select Case dataType
				Case "int16"
					dataType = "short"
				Case "int32"
					dataType = "int"
				Case "int64"
					dataType = "long"
				Case "single"
					dataType = "float"
				Case "boolean"
					dataType = "bool"
				Case "datetime"
					dataType = "DateTime"
                Case "decimal"
                    'This is for oracle
                    If field.NativeType.ToString().ToLower() = "number" AndAlso field.Scale = 0 Then
                        If field.Precision <= 4 Then
                            datatype = "short"
                        ElseIf field.Precision <= 9 Then
                            datatype = "int"
                        Else
                            dataType = "long"
                        End If
                    End If
                Case "object"
                    if field.NativeType.ToString().Tolower() = "blob" then 
                        dataType = "byte[]"
                    elseif field.NativeType.ToString().Tolower() = "clob" then 
                        dataType = "string"
                    else
                        dataType = "object"
                    end if 
			End Select
		
			Return dataType
		End Function
        
        
		
        Public Function GetCSType(ByVal field As DataObjectBase) As String
            'return field.NativeType;
           If field.NativeType.ToLower() = "real" Then
                Return "System.Single"
			elseif field.NativeType.ToLower() = "char" then
				Return "System.String"
			elseif field.NativeType.ToLower() = "tinyint" then
				Return "System.Byte"
			elseif field.NativeType.ToLower() = "smallint" then
				Return "System.Int16"
			elseif field.NativeType.ToLower() = "bigint" then
				return "System.Int64"
			elseif field.NativeType.ToLower() = "integer" then
				return "System.Int32"
            Else
                Return field.SystemType.ToString()
            End If
            'return GetCSType(field.DataType);
        End Function
		
		Public Function GetCSharpType(byval field As DataObjectBase) As String 
			If field.NativeType.ToLower() = "real" Then
				Return "Single"
			elseif field.NativeType.ToLower() = "char" then
				Return "String"
			elseif field.NativeType.ToLower() = "varchar" then
				Return "String"
			elseif field.NativeType.ToLower() = "tinyint" then
				Return "Byte"
			elseif field.NativeType.ToLower() = "smallint" then
				Return "Int16"
			elseif field.NativeType.ToLower() = "bigint" then
				return "Int64"
			elseif field.NativeType.ToLower() = "integer" then
				return "Int32"
			elseif field.NativeType.ToLower() = "int" then
				return "Int32"
			elseif field.NativeType.ToLower() = "datetime" then
				return "DateTime"
			Else
				Return field.NativeType.ToLower()
			End If
		End Function

        Public Function GetNullableType(ByVal dataType As DbType) As String
            Select Case dataType
                Case DbType.AnsiString
                    Return "NullableString"
                Case DbType.AnsiStringFixedLength
                    Return "NullableString"
                Case DbType.Binary
                    Return "NullableByte()"
                Case DbType.Boolean
                    Return "NullableBoolean"
                Case DbType.Byte
                    Return "NullableByte"
                Case DbType.Currency
                    Return "NullableDecimal"
                Case DbType.Date
                    Return "NullableDateTime"
                Case DbType.DateTime
                    Return "NullableDateTime"
                Case DbType.Decimal
                    Return "NullableDecimal"
                Case DbType.Double
                    Return "NullableDouble"
                Case DbType.Guid
                    Return "NullableGuid"
                Case DbType.Int16
                    Return "NullableInt16"
                Case DbType.Int32
                    Return "NullableInt32"
                Case DbType.Int64
                    Return "NullableInt64"
                Case DbType.Object
                    Return "object"
                Case DbType.Single
                    Return "NullableSingle"
                Case DbType.String
                    Return "NullableString"
                Case DbType.StringFixedLength
                    Return "NullableString"
                Case DbType.Time
                    Return "NullableDateTime"
                Case DbType.VarNumeric
                    Return "NullableDecimal"
                    'the following won't be used
                    '		case DbType.SByte: return "NullableSByte";
                    '		case DbType.UInt16: return "NullableUShort";
                    '		case DbType.UInt32: return "NullableUInt";
                    '		case DbType.UInt64: return "NullableULong";
                Case Else
                    Return "object"
            End Select
        End Function

        Public Function GetNullableType(ByVal field As DataObjectBase) As String
            Return GetNullableType(field.DataType)
        End Function

        Public Function GetNullableType(ByVal dataType As String) As String
            Try
                Return GetNullableType(CType(System.Enum.Parse(GetType(DbType), dataType), DbType))
            Catch
                Return "object"
            End Try
        End Function

        Public Function GetCSDefaultByType(ByVal column As DataObjectBase) As String
            If column.NativeType.ToLower() = "real" Then
                Return "0.0"
            Else
                Dim dataType As DbType = column.DataType
                Select Case dataType
                    Case DbType.AnsiString
                        Return "string.Empty"

                    Case DbType.AnsiStringFixedLength
                        Return "string.Empty"

                    Case DbType.String
                        Return "string.Empty"

                    Case DbType.Boolean
                        Return "false"

                    Case DbType.StringFixedLength
                        Return "string.Empty"

                    Case DbType.Guid
                        Return "Guid.Empty"


                        'Answer modified was just 0
                    Case DbType.Binary
                        Return "new byte() {}"

                        'Answer modified was just 0
                    Case DbType.Byte
                        Return "0"
                        'return "{ 0 }";

                    Case DbType.Currency
                        Return "0"

                    Case DbType.Date
                        Return "DateTime.MinValue"

                    Case DbType.DateTime
                        Return "DateTime.MinValue"

                    Case DbType.Decimal
                        Return "0.0"
                        'return "0M";
                        'return "0.0M";

                    Case DbType.Double
                        Return "0.0"

                    Case DbType.Int16
                        Return "0"

                    Case DbType.Int32
                        Return "0"

                    Case DbType.Int64
                        Return "0"

                    Case DbType.Object
                        Return "null"

                    Case DbType.Single
                        Return "0"

                        'case DbType.Time: return "DateTime.MaxValue";
                    Case DbType.Time
                        Return "new DateTime(1900,1,1,0,0,0,0)"
                    Case DbType.VarNumeric
                        Return "0"
                        'the following won't be used
                        '		case DbType.SByte: return "0";
                        '		case DbType.UInt16: return "0";
                        '		case DbType.UInt32: return "0";
                        '		case DbType.UInt64: return "0";
                    Case Else
                        Return "null"
                End Select
            End If
        End Function

        Public Function GetCSMockValueByType(ByVal column As DataObjectBase, ByVal stringValue As String, ByVal bValue As Boolean, ByVal guidValue As Guid, ByVal numValue As Integer, ByVal dtValue As DateTime) As String
            If column.NativeType.ToLower() = "real" Then
                Return numValue.ToString() & "F"
            Else
                Select Case column.DataType
                    Case DbType.AnsiString
                        Return """" & stringValue & """"

                    Case DbType.AnsiStringFixedLength
                        Return """" & stringValue & """"

                    Case DbType.String
                        Return """" & stringValue & """"

                    Case DbType.Boolean
                        Return bValue.ToString().ToLower()

                    Case DbType.StringFixedLength
                        Return """" & stringValue & """"

                    Case DbType.Guid
                        Return "new Guid(""" & guidValue.ToString() & """)"


                        'Answer modified was just 0
                    Case DbType.Binary
                        Return "new byte() {" & numValue.ToString() & "}"

                        'Answer modified was just 0
                    Case DbType.Byte
                        Return "(byte)" & numValue.ToString() & ""
                        'return "{ 0 }";

                    Case DbType.Currency
                        Return numValue.ToString()

                    Case DbType.Date
                        Return String.Format("new DateTime({0}, {1}, {2}, 0, 0, 0, 0)", dtValue.Date.Year, dtValue.Date.Month, dtValue.Date.Day)

                    Case DbType.DateTime
                        Return String.Format("new DateTime({0}, {1}, {2}, {3}, {4}, {5}, {6})", dtValue.Year, dtValue.Month, dtValue.Day, dtValue.Hour, dtValue.Minute, dtValue.Second, dtValue.Millisecond)

                    Case DbType.Decimal
                        Return numValue.ToString() & "m"
                        'return "0M";
                        'return "0.0M";

                    Case DbType.Double
                        Return numValue.ToString() & ".0f"

                    Case DbType.Int16
                        Return "(short)" & numValue.ToString()

                    Case DbType.Int32
                        Return "(int)" & numValue.ToString()

                    Case DbType.Int64
                        Return "(long)" & numValue.ToString()

                    Case DbType.Object
                        Return "null"

                    Case DbType.Single
                        Return numValue.ToString() & "F"

                        'case DbType.Time: return "DateTime.MaxValue";
                    Case DbType.Time
                        Return String.Format("new DateTime({0}, {1}, {2}, {3}, {4}, {5}, {6})", dtValue.Year, dtValue.Month, dtValue.Day, dtValue.Hour, dtValue.Minute, dtValue.Second, dtValue.Millisecond)

                    Case DbType.VarNumeric
                        Return numValue.ToString()
                        'the following won't be used
                        '		case DbType.SByte: return "0";
                        '		case DbType.UInt16: return "0";
                        '		case DbType.UInt32: return "0";
                        '		case DbType.UInt64: return "0";
                    Case Else
                        Return "null"
                End Select
            End If
        End Function

        Public Function GetSqlDbType(ByVal column As DataObjectBase) As String
            Select Case column.NativeType
                Case "bigint"
                    Return "BigInt"
                Case "binary"
                    Return "Binary"
                Case "bit"
                    Return "Bit"
                Case "char"
                    Return "Char"
                Case "datetime"
                    Return "DateTime"
                Case "decimal"
                    Return "Decimal"
                Case "float"
                    Return "Float"
                Case "image"
                    Return "Image"
                Case "int"
                    Return "Int"
                Case "money"
                    Return "Money"
                Case "nchar"
                    Return "NChar"
                Case "ntext"
                    Return "NText"
                Case "numeric"
                    Return "Decimal"
                Case "nvarchar"
                    Return "NVarChar"
                Case "real"
                    Return "Real"
                Case "smalldatetime"
                    Return "SmallDateTime"
                Case "smallint"
                    Return "SmallInt"
                Case "smallmoney"
                    Return "SmallMoney"
                Case "sql_variant"
                    Return "Variant"
                Case "sysname"
                    Return "NChar"
                Case "text"
                    Return "Text"
                Case "timestamp"
                    Return "Timestamp"
                Case "tinyint"
                    Return "TinyInt"
                Case "uniqueidentifier"
                    Return "UniqueIdentifier"
                Case "varbinary"
                    Return "VarBinary"
                Case "varchar"
                    Return "VarChar"
                Case Else
                    Return "__UNKNOWN__" & column.NativeType
            End Select
        End Function

        Public Function FKColumnName(ByVal fkey As TableKeySchema) As String
            Dim Name As String = String.Empty
            Dim x As Integer = 0
            'ORIGINAL LINE: for(int x=0;x < fkey.ForeignKeyMemberColumns.Count;x += 1)
            'INSTANT VB NOTE: This 'for' loop was translated to a VB 'Do While' loop:
            Do While x < fkey.ForeignKeyMemberColumns.Count
                Name &= fkey.ForeignKeyMemberColumns(x).Name
                x += 1
            Loop
            Return Name
        End Function

        Private Function GetIXColumnName(ByVal index As IndexSchema,Optional ByVal Seperator As String = "") As String
            Dim Name As String = String.Empty
            Dim x As Integer = 0
            'ORIGINAL LINE: for(int x=0;x < index.MemberColumns.Count;x += 1)
            'INSTANT VB NOTE: This 'for' loop was translated to a VB 'Do While' loop:
            Do While x < index.MemberColumns.Count
				Name &= index.MemberColumns(x).Name
				If Seperator.Length > 0 Then
					If x < index.MemberColumns.Count - 1 Then Name &= Seperator
				End If
				x += 1
            Loop
            Return Name
        End Function
		
        Public Function IXColumnName(ByVal index As IndexSchema) As String
			Return GetIXColumnName(index)
        End Function

		Public Function IXColumnName(ByVal index As IndexSchema, ByVal seperator as String) As String
			Return GetIXColumnName(index, seperator)
        End Function

        Public Function GetKeysName(ByVal keys As ColumnSchemaCollection) As String
            Dim result As String = String.Empty
            Dim x As Integer = 0
            'ORIGINAL LINE: for(int x=0; x < keys.Count;x += 1)
            'INSTANT VB NOTE: This 'for' loop was translated to a VB 'Do While' loop:
            Do While x < keys.Count
                result &= keys(x).Name
                x += 1
            Loop
            Return result
        End Function

        Public Function IsMultiplePrimaryKeys(ByVal keys As ColumnSchemaCollection) As Boolean
            If keys.Count > 1 Then
                Return True
            End If
            Return False
        End Function

        Public Function isIntXX(ByVal column As ColumnSchema) As Boolean
            Dim result As Boolean = False

            Dim i As Integer = 0
            'ORIGINAL LINE: for(int i = 0; i < aIntegerDbTypes.Length; i += 1)
            'INSTANT VB NOTE: This 'for' loop was translated to a VB 'Do While' loop:
            Do While i < aIntegerDbTypes.Length
                If aIntegerDbTypes(i) = column.DataType Then
                    result = True
                End If
                i += 1
            Loop

            Return result
        End Function

    End Class

    Public Class columnSchemaComparer
        Implements IComparer

        Private Function Compare(ByVal x As Object, ByVal y As Object) As Integer Implements IComparer.Compare
            If TypeOf x Is ColumnSchema AndAlso TypeOf y Is ColumnSchema Then
                Return ((New CaseInsensitiveComparer).Compare((CType(x, ColumnSchema)).Name, (CType(y, ColumnSchema)).Name))
            End If

            Throw New ArgumentException("one or both object(s) are not of type ColumnSchema")
        End Function

#Region "Execute sql file"

        Public Sub ExecuteSqlInFile(ByVal pathToScriptFile As String, ByVal connectionString As String)
            Dim connection As SqlConnection
            Dim _reader As StreamReader = Nothing
            Dim sql As String = ""

            If False = System.IO.File.Exists(pathToScriptFile) Then
                Throw New Exception("File " & pathToScriptFile & " does not exists")
            End If
            'INSTANT VB NOTE: The following 'using' block is replaced by its pre-VB.NET 2005 equivalent:
            '			using(Stream stream = System.IO.File.OpenRead(pathToScriptFile))
            Dim stream As Stream = System.IO.File.OpenRead(pathToScriptFile)
            Try
                _reader = New StreamReader(stream)

                connection = New SqlConnection(connectionString)

                Dim command As SqlCommand = New SqlCommand

                connection.Open()
                command.Connection = connection
                command.CommandType = System.Data.CommandType.Text

                'TODO: INSTANT VB TODO TASK: Assignments within expressions are not supported in VB.NET
                'ORIGINAL LINE: while(Nothing != (sql = ReadNextStatementFromStream(_reader)))
                While Nothing <> (sql <= ReadNextStatementFromStream(_reader))
                    command.CommandText = sql

                    command.ExecuteNonQuery()
                End While

                _reader.Close()
            Finally

                Dim disp As IDisposable = stream
                disp.Dispose()
            End Try
            'INSTANT VB NOTE: End of the original C# 'using' block
            connection.Close()

        End Sub


        Private Shared Function ReadNextStatementFromStream(ByVal _reader As StreamReader) As String
            Dim sb As StringBuilder = New StringBuilder

            Dim lineOfText As String

            Do While True
                lineOfText = _reader.ReadLine()
                If lineOfText Is Nothing Then

                    If sb.Length > 0 Then
                        Return sb.ToString()
                    Else
                        Return Nothing
                    End If
                End If

                If lineOfText.TrimEnd().ToUpper() = "GO" Then
                    Exit Do
                End If

                sb.Append(lineOfText & Environment.NewLine)
            Loop

            Return sb.ToString()
        End Function

#End Region

        Public Class TableSchemaExtended
            Inherits TableSchema

            Private nonKeysUpdatable As ColumnSchemaCollection
            Private colsUpdatable As ColumnSchemaCollection

            Public Sub New(ByVal p0 As DatabaseSchema, ByVal p1 As String, ByVal p2 As String, ByVal p3 As DateTime)
                MyBase.New(p0, p1, p2, p3)
            End Sub

            Public Sub New(ByVal p0 As DatabaseSchema, ByVal p1 As String, ByVal p2 As String, ByVal p3 As DateTime, ByVal p4 As ExtendedProperty())
                MyBase.New(p0, p1, p2, p3)
            End Sub

            Private Sub init()
                colsUpdatable = New ColumnSchemaCollection
                For Each column As ColumnSchema In Me.Columns
                    If (CBool(column.ExtendedProperties("CS_IsComputed").Value)) = False AndAlso column.NativeType.ToLower() <> "timestamp" Then
                        colsUpdatable.Add(column)
                    End If
                Next column
                ' [ab 012605] nonKeys sans computed/read-only columns. This is for Insert/Update operations
                nonKeysUpdatable = New ColumnSchemaCollection
                For Each column As ColumnSchema In Me.NonPrimaryKeyColumns
                    If (CBool(column.ExtendedProperties("CS_IsComputed").Value)) = False AndAlso column.NativeType.ToLower() <> "timestamp" Then
                        nonKeysUpdatable.Add(column)
                    End If
                Next column
                ' [ab 013105] alpha sort the collections, to guarantee the same order between entity props and sp params when they are being assigned
                ' Debugger.Break();
                Dim colNameComparer As IComparer = New columnSchemaComparer
                colsUpdatable.Sort(colNameComparer)
                nonKeysUpdatable.Sort(colNameComparer)
            End Sub

#Region "Children Collections"
            Private _collections As System.Collections.ArrayList = New System.Collections.ArrayList
            Private _renderedChildren As System.Collections.ArrayList = New System.Collections.ArrayList
            Private _currentTable As String = String.Empty

            Public Function GetChildrenCollections(ByVal table As SchemaExplorer.TableSchema, ByVal tables As SchemaExplorer.TableSchemaCollection) As System.Collections.ArrayList
                'System.Diagnostics.Debugger.Break();
                'CleanUp
                Dim commonSqlCode As New CommonSqlCode

                If Not CurrentTable Is table.Name Then
                    _collections.Clear()
                    _renderedChildren.Clear()
                    CurrentTable = table.Name
                End If

                If _collections.Count > 0 Then
                    Return _collections
                End If


                'Provides Informatoin about the foreign keys
                Dim fkeys As TableKeySchemaCollection = New TableKeySchemaCollection(table.ForeignKeys)
                'Provides information about the indexes contained in the table. 
                Dim indexes As IndexSchemaCollection = New IndexSchemaCollection(table.Indexes)

                Dim primaryKeyCollection As TableKeySchemaCollection = New TableKeySchemaCollection(table.PrimaryKeys)

                Dim keyschema As TableKeySchema
                For Each keyschema In primaryKeyCollection
                    ' add the relationship only if the linked table is part of the selected tables (ie: omit tables without primary key)
                    If Not tables.Contains(keyschema.ForeignKeyTable.Owner, keyschema.ForeignKeyTable.Name) Then

                    End If

                    'Add 1-1 relations
                    If IsRelationOneToOne(keyschema) Then
                        Dim collectionInfo As CollectionInfo = New CollectionInfo
                        collectionInfo.PkColName = table.PrimaryKey.MemberColumns(0).Name
                        collectionInfo.PkIdxName = keyschema.Name
                        collectionInfo.PrimaryTable = table.Name
                        collectionInfo.SecondaryTable = keyschema.ForeignKeyTable.Name
                        collectionInfo.SecondaryTablePkColName = keyschema.ForeignKeyTable.PrimaryKey.MemberColumns(0).Name
                        collectionInfo.CollectionRelationshipType = RelationshipType.OneToOne
                        collectionInfo.CleanName = keyschema.ForeignKeyTable.Name 'GetClassName(keyschema.ForeignKeyTable.Name);		
                        collectionInfo.CollectionName = commonSqlCode.GetCollectionClassName(collectionInfo.CleanName)
                        collectionInfo.CallParams = GetFunctionRelationshipCallParameters(keyschema.ForeignKeyMemberColumns)
                        collectionInfo.GetByKeysName = "GetBy" + commonSqlCode.GetKeysName(keyschema.ForeignKeyMemberColumns)

                        _collections.Add(collectionInfo)

                        'Add 1-N,N-1 relations
                    Else
                        Dim collectionInfo As CollectionInfo = New CollectionInfo
                        collectionInfo.PkColName = table.PrimaryKey.MemberColumns(0).Name
                        collectionInfo.PkIdxName = keyschema.Name
                        collectionInfo.PrimaryTable = table.Name
                        collectionInfo.SecondaryTable = keyschema.ForeignKeyTable.Name
                        collectionInfo.SecondaryTablePkColName = keyschema.ForeignKeyTable.PrimaryKey.MemberColumns(0).Name
                        collectionInfo.CollectionRelationshipType = RelationshipType.OneToMany
                        collectionInfo.CleanName = keyschema.ForeignKeyTable.Name 'GetClassName(keyschema.ForeignKeyTable.Name);
                        collectionInfo.CollectionName = commonSqlCode.GetCollectionClassName(collectionInfo.CleanName)
                        collectionInfo.CallParams = GetFunctionRelationshipCallParameters(table.PrimaryKey.MemberColumns)
                        'collectionInfo.CallParams = GetFunctionRelationshipCallParameters(keyschema.ForeignKeyMemberColumns);
                        collectionInfo.GetByKeysName = "GetBy" + commonSqlCode.GetKeysName(keyschema.ForeignKeyMemberColumns)
                        'collectionInfo.GetByKeysName = "GetBy" + GetKeysName(keyschema.ForeignKeyTable.PrimaryKey.MemberColumns);

                        _collections.Add(collectionInfo)
                    End If
                Next

                'Add N-N relations
                Dim junctionTable As TableSchema
                Dim primarykey As TableKeySchema
                For Each primarykey In primaryKeyCollection
                    ' add the relationship only if the linked table is part of the selected tables (ie: omit tables without primary key)
                    If Not tables.Contains(primarykey.ForeignKeyTable.Owner, primarykey.ForeignKeyTable.Name) Then

                    End If

                    If IsJunctionTable(primarykey.ForeignKeyTable) Then

                        Dim collectionInfo As CollectionInfo = New CollectionInfo
                        junctionTable = primarykey.ForeignKeyTable
                        Dim t As TableKeySchema
                        For Each t In junctionTable.ForeignKeys
                            'Warning: Assumes 1st column is primary key.
                            If Not (t.ForeignKeyMemberColumns(0) Is primarykey.ForeignKeyMemberColumns(0)) Then
                                collectionInfo.PkColName = table.PrimaryKey.MemberColumns(0).Name
                                collectionInfo.PkIdxName = t.Name
                                collectionInfo.PrimaryTable = table.Name
                                collectionInfo.SecondaryTable = t.PrimaryKeyTable.Name
                                collectionInfo.SecondaryTablePkColName = t.PrimaryKeyTable.PrimaryKey.MemberColumns(0).Name
                                collectionInfo.JunctionTable = junctionTable.Name
                                collectionInfo.CollectionName = commonSqlCode.GetManyToManyName(commonSqlCode.GetCollectionClassName(collectionInfo.SecondaryTable), collectionInfo.JunctionTable)
                                collectionInfo.CollectionRelationshipType = RelationshipType.ManyToMany
                                collectionInfo.CallParams = "entity." + collectionInfo.PkColName
                                collectionInfo.GetByKeysName = "GetBy" + commonSqlCode.GetManyToManyName(collectionInfo.PrimaryTable, collectionInfo.JunctionTable)

                                '/Find FK junc table key, used for loading scenarios
                                If junctionTable.PrimaryKey.MemberColumns(0) Is t.ForeignKeyMemberColumns(0) Then
                                    collectionInfo.FkColName = junctionTable.PrimaryKey.MemberColumns(1).Name
                                Else
                                    collectionInfo.FkColName = junctionTable.PrimaryKey.MemberColumns(0).Name
                                End If

                                collectionInfo.CleanName = commonSqlCode.GetManyToManyName(t.PrimaryKeyTable.Name, junctionTable.Name)
                                _collections.Add(collectionInfo)
                            End If
                        Next
                    End If
                Next
                ' end N-N relations
                Return _collections
            End Function

            Public Function GetFunctionRelationshipCallParameters(ByVal columns As ColumnSchemaCollection) As String
                Dim output As String = ""
                Dim i As Integer
                For i = 0 To columns.Count - 1 Step i + 1
                    output += "entity." + columns(i).Name
                    If i < columns.Count - 1 Then
                        output += ", "
                    End If
                Next
                Return output
            End Function


            Public Function IsJunctionTable(ByVal table As TableSchema) As Boolean
                If table.PrimaryKey Is Nothing Or table.PrimaryKey.MemberColumns.Count = 0 Then
                    'Response.WriteLine(string.Format("IsJunctionTable: The table {0} doesn't have a primary key.", table.Name));
                    Return False

                End If
                If table.PrimaryKey.MemberColumns.Count = 1 Then
                    Return False
                End If

                ' TODO tables with primary key = 1 foreign key

                Dim i As Integer
                For i = 0 To table.PrimaryKey.MemberColumns.Count - 1 Step i + 1
                    If Not table.PrimaryKey.MemberColumns(i).IsForeignKeyMember Then
                        Return False
                    End If
                Next
                Return True
            End Function

            Public Function IsRelationOneToOne(ByVal keyschema As TableKeySchema) As Boolean
                Dim i As IndexSchema
                For Each i In keyschema.ForeignKeyTable.Indexes
                    If (i.MemberColumns(0).Name = keyschema.ForeignKeyMemberColumns(0).Name) And (Not IsJunctionTable(keyschema.ForeignKeyTable)) Then
                        If i.IsUnique Or i.IsPrimaryKey Then
                            Return True
                        Else
                            Return False
                        End If
                    End If
                Next
                Return False
            End Function

            Public Function GetRelationKeyColumns(ByVal fkeys As TableKeySchemaCollection, ByVal indexes As IndexSchemaCollection) As ColumnSchemaCollection
                System.Diagnostics.Debugger.Break()
                Dim j As Integer = 0
                'ORIGINAL LINE: for (int j=0; j < fkeys.Count; j += 1)
                'INSTANT VB NOTE: This 'for' loop was translated to a VB 'Do While' loop:
                Do While j < fkeys.Count
                    Dim skipkey As Boolean = False
                    For Each i As IndexSchema In indexes
                        If i.MemberColumns.Contains(fkeys(j).ForeignKeyMemberColumns(0)) Then
                            skipkey = True
                        End If

                    Next i
                    If skipkey Then
                        GoTo Continue1
                    End If

                    Return fkeys(j).ForeignKeyMemberColumns
                    j += 1
Continue1:
                Loop
                Return New ColumnSchemaCollection
            End Function

            <BrowsableAttribute(False)> _
            Public Property CurrentTable() As String
                Get
                    Return _currentTable
                End Get
                Set(ByVal Value As String)
                    _currentTable = Value
                End Set
            End Property

            <BrowsableAttribute(False)> _
            Public Property RenderedChildren() As System.Collections.ArrayList
                Get
                    Return _renderedChildren
                End Get
                Set(ByVal Value As System.Collections.ArrayList)
                    _renderedChildren = Value
                End Set
            End Property
		
		
		'/ <summary>
		'/ Get a SqlParameter statement for a column
		'/ </summary>
		'/ <param name="column">Column for which to get the Sql parameter statement</param>
		'/ <param name="isOutput">indicates the direction</param>
		'/ <returns>Sql Parameter statement</returns>
		Public overloads Function GetSqlParameterXmlNode(ByVal column As ColumnSchema, ByVal isOutput As Boolean) As String
			Return GetSqlParameterXmlNode(column,column.Name,isOutput,False)
		End Function
		
		'/ <summary>
		'/ Get a SqlParameter statement for a column
		'/ </summary>
		'/ <param name="column">Column for which to get the Sql parameter statement</param>
		'/ <param name="parameterName">the name of the parameter?</param>
		'/ <param name="isOutput">indicates the direction</param>
		'/ <returns>the xml Sql Parameter statement</returns>
		Public Overloads Function GetSqlParameterXmlNode(ByVal column As ColumnSchema, ByVal parameterName As String, ByVal isOutput As Boolean) As String
			Return GetSqlParameterXmlNode(column,parameterName,isOutput,False)
		End Function
		
		'/ <summary>
		'/ Get a SqlParameter statement for a column
		'/ </summary>
		'/ <param name="column">Column for which to get the Sql parameter statement</param>
		'/ <param name="parameterName">the name of the parameter?</param>
		'/ <param name="isOutput">indicates the direction</param>
		'/ <param name ="nullDefaults">indicates whether to give each parameter a null or empty default.  (used mainly for Find sp's)</param>
		'/ <returns>the xml Sql Parameter statement</returns>
		Public overloads Function GetSqlParameterXmlNode(ByVal column As ColumnSchema, ByVal parameterName As String, ByVal isOutput As Boolean, ByVal nullDefaults As Boolean) As String
			Dim formater As String = "<parameter name=""@{0}"" type=""{1}"" direction=""{2}"" size=""{3}"" precision=""{4}"" scale=""{5}"" param=""{6}"" nulldefault=""{7}""/>"
 
			Dim nullDefaultValue As String =  "" 
 
			if (nullDefaults) Then
				nullDefaultValue = "null"
			End if
 
			dim strDirection as String 
			If (isOutput) Then strDirection = "Output" Else strDirection = "Input"
			Return String.Format(formater, parameterName, column.NativeType, strDirection, column.Size, column.Precision, column.Scale, GetSqlParameterParam(column), NullDefaultValue)
		End Function
		

		
		Public function GetSqlParameterParam(column as ColumnSchema) as String
			dim param as String = "[" + column.Name + "] " + column.NativeType
			
			
			Select Case column.DataType
				Case DbType.Decimal
					param += "(" + column.Precision + ", " + column.Scale + ")"
					
				Case DbType.AnsiString
				Case DbType.AnsiStringFixedLength
				Case DbType.String
				Case DbType.StringFixedLength
					if column.NativeType <> "text" and column.NativeType <> "ntext" Then
						If column.Size > 0 Then
							param += "(" + column.Size.ToString + ") COLLATE database_default "
						End If
					End If
			End Select
		
			Return param
			
		End Function
		
            '''<summary>
            '''  Store the most recent <see cref"SourceTable" /> of the templates,
            '''  Used to clean up upon new SourceTable execution.  
            '''</summary>
            '''<summary>
            ''' Child Collection RelationshipType Enum
            '''</summary>
            <BrowsableAttribute(False)> _
            Public Enum RelationshipType
                None = 0
                OneToOne = 1
                OneToMany = 2
                ManyToOne = 3
                ManyToMany = 4
            End Enum
            

            Public Class CollectionInfo
                Public CleanName As String
                Public PkColName As String
                Public PkIdxName As String
                Public FkColName As String
                Public FkIdxName As String
                Public PrimaryTable As String
                Public SecondaryTable As String
                Public SecondaryTablePkColName As String
                Public JunctionTable As String
                Public CollectionName As String = String.Empty
                Public CallParams As String = String.Empty
                Public PropertyString As String = String.Empty
                Public GetByKeysName As String = String.Empty
                Public CollectionRelationshipType As RelationshipType
            End Class
#End Region


        End Class

    End Class
End Namespace