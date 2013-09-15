/*
  # Rollcall 
  *
  # Web-Application for Teachers to mantain Attendences
  *
  # "Rollcall helps Teachers to keep track of 'Class-Attendence' in an easy and attractive way"
  *
  # build on 'localStorage'
  *
  # Depends on 'localstoragedb.js' database layer 
*/

// pre-build database 'box'
var box = new localStorageDB("databox");

// extra-space to store some useful data
	if(!(box.tableExists('blackBox')))
	{
	    box.createTable('blackBox', ["key", "value", "description"]);
	}
	
/*
  # script part :: to control I/O  
*/

// creates 'class-object' as a table in 'box'
// params -> {name:class_name} 
function createClass(name)
{
    var className = name;
    // special characters not allowed in var 'name'
	var next = className.match(/[^a-z_0-9]/) ? false : true;
	if(!(next))
	{ /*link-error-position*/ }
	
	// class exists already
	if(box.tableExists(name))
	{
	    /* throw an error pop-up with 'bootstrap' */
	}
	else
	{
	    box.createTable("+className+", ["SerialNo", "Student", "EnrollNo", "presenceCount"]);
	    box.commit();
	}
}

function removeClass(name)
{
    var className = name;
	// special characters not allowed
	var next = className.match(/[^a-z_0-9]/) ? false : true;
	if(!(next))
	{ /*link-error-position*/ }
	
	if(box.tableExists(className))
	{
	    box.dropTable(className);
		box.commit();
	}
	
	// class does't exists
	else
	{
	    /* error pop-up */
	}
}

// add a 'student' to a 'Class'
function addStudent(student, Sno, ENo, Class)
{
    // special characters not allowed in var 'Class'
	var next = className.match(/[^a-z_0-9]/) ? false : true;
	if(!(next))
	{ /*link-error-position*/ }
	
    if(!(box.tableExists(Class)))
	{
	    /* throw an error pop-up with 'bootstrap' */
	}
	else
	{
	    box.insert(Class, {SerialNo: Sno, Student: student, EnrollNo: ENo, presenceCount: 0});
		box.commit();
	}
}

// remove a 'student' from a 'Class'
function removeStudent(student, ENo, Class)
{
    // params -> both 'student name' and 'Enroll No.' to detect right student
	
    // special characters not allowed
	
    if(!(box.tableExists(Class)))
	{
	    /* throw an error pop-up with 'bootstrap' */
	}
	else
	{	
		box.deleteRows(Class, function(row) {
		    if((row.Student == student) && (row.EnrollNo == ENo))
			{
			    // delete :- 'student' with given details
			    return true;
			}
			else
			{
			    /* error pop-up : unable to detect exactly */
			}
		});
	}
}
	
	
/*
  # script part :: to take 'Attendence'
*/

// retrieve elements from 'Class' and show them listed
function generateList(Class)
{
    // special characters not allowed
	
	if(!(box.tableExists(Class)))
	{/* error : pop-up */}
	if(box.tableExists(Class))
	{		
	    // to supply 'argument' to 'saveList()'
	    box.insertOrUpdate('blackBox', {description: 'param_for_saveList'}, {key: 'argument', value: Class, description: 'param_for_saveList'});
		console.log('blackBox-ed');
		
        // number of students in the 'Class'
        var size = box.rowCount(Class);
	
	    var result = "";
	    result += "<table><thead><tr><th>Sr.No.</th><th>Enroll No.</th><th>Student</th><th>Present</th></tr></thead>";
	    result += "<tbody>";
	
	    for(var i=0;i<size;i++)
	   {
	        var source = box.query(Class)[i];
	        var SNo = source.SerialNo;
	        var ENo = source.EnrollNo;
	        var Name = source.Student;
		
		    result += "<tr><td>"+SNo+"</td><td>"+ENo+"</td><td>"+Name+"</td><td><input type='checkbox' id="+i+"></td></tr>"
	   }
	    result += "</tbody></table>"
	
	    document.write(result);
	}
}

// on the basis of 'checkboxes', update 'presenceCount' for a 'row'
function saveList() // who will give 'Class' to this block
{
    // give recently generated class
	var Class = box.query('blackBox', {description: 'param_for_saveList'})[0].value;

    // number of students in the 'Class'
    var size = box.rowCount(Class);
	
	for(var i=0;i<size;i++)
	{
	    // if 'checkbox' checked
	    if(document.getElementById(i).checked)
		{
		    var where = box.query(Class)[i].EnrollNo;
			box.update(Class, {EnrollNo: where}, function(row) {
			    row.presenceCount+=1;
				return row;
			});
			box.commit();
		}
	}
}
