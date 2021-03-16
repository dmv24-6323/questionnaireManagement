$(document).ready(function(){

    /* Added for reordering of questions in table */
    var fixHelper = function(e, ui) {
        ui.children().each(function() {
            $(this).width($(this).width());
        });
        return ui;
    };
    $("#dataTable tbody").sortable({
        helper: fixHelper
    }).disableSelection();

    if($("#tableHeading").text() == "Default"){
        $("#tableHeadModify").hide();
        $("#tableHeadDelete").hide();
    }

    /* Click action of question list shown in left side of template */
    $(".questionList").click(function(){
        $("#addQue").hide();
        $("#tableHeadModify").hide();
        $("#tableHeadDelete").hide();
        $("tbody").empty();
        $(".appendModals").empty();
        $(".addButtons").empty();
        var qId = $(this).attr('id');
        var tableName = $(this).attr('data');
        var isAdmin = $(this).attr('user');
        var res = "";
        var modalUpdate = "";
        var modalDelete = "";
        var addQuestionButton = "";
        var activeButton = "";
        var reorderButton = "";
        var qType = "";
        var csrf = $('input[name$="csrfmiddlewaretoken"]').val();
        //alert(qId);
        if(tableName != "Default"){
            $("#tableHeadModify").show();
            if(isAdmin == "Admin"){
                $("#tableHeadDelete").show();
            }
        }
        $.ajax({
            url: 'questions',
            type: 'post',
            data: {
                'id': qId
            },
            dataType: 'json',
            success: function(response) {
                /*$.each(response.data, function( index, value ) {
                  console.log(value.id );
                  console.log(value.qlistId );
                  console.log(value.question );
                  console.log(value.qType );
                  console.log(value.qStatus );
                });*/
                if(response.data[0] != null){
                    $("#tableHeading").text(tableName);
                    if(tableName != "Default"){
                        addQuestionButton = '<button class="btn btn-primary mr-1" name="addQuestion" taskid="'+ response.data[0].qlistId +'" id="addQuestion">Add Question</button>';
                        activeButton = '<button class="btn btn-danger mr-1" name="activeButton" taskid="'+ response.data[0].qlistId +'" id="activeButton">Activate</button>';
                        reorderButton = '<button class="btn btn-warning" name="reorderButton" taskid="'+ response.data[0].qlistId +'" id="reorderButton">Reorder</button>';
                        $(".addButtons").append(addQuestionButton);
                        $(".addButtons").append(activeButton);
                        $(".addButtons").append(reorderButton);
                        $("#reorderButton").css("margin-right","auto");
                        if(response.count >= 10){
                            $("#addQuestion").hide();
                        }
                        else{
                            $("#addQuestion").show();
                        }
                    }
                    var count = 1;
                    $.each(response.data, function( index, value ) {
                        modalUpdate = "";
                        modalDelete = "";
                        if(value.qType == "t"){
                            qType = "Text box";
                        }
                        else if(value.qType == "c"){
                            qType = "Check box";
                        }
                        else if(value.qType == "r"){
                            qType = "Radio button";
                        }
                        else if(value.qType == "s"){
                            qType = "Slider";
                        }
                        if(tableName != "Default"){
                            if(isAdmin != "Admin"){
                                res = '<tr>' +
                                      '<td>' +  count  + '</td>' +
                                      '<td id="que_'+ value.id +'">' + value.question + '</td>' +
                                      '<td id="queType_'+ value.id +'">' + qType + '</td>' +
                                      '<td><button class="btn btn-primary btn-sm updateLink" id="'+ value.id +'"data-toggle="modal" data-target="#updateModal_'+ value.id +'"><span><i class="fa fa-edit"></i></span></button></td>'+
                                      '</tr>';
                            }
                            else{
                                res = '<tr>' +
                                      '<td>' +  count  + '</td>' +
                                      '<td id="que_'+ value.id +'">' + value.question + '</td>' +
                                      '<td id="queType_'+ value.id +'">' + qType + '</td>' +
                                      '<td><button class="btn btn-primary btn-sm updateLink" id="'+ value.id +'"data-toggle="modal" data-target="#updateModal_'+ value.id +'"><span><i class="fa fa-edit"></i></span></button></td>'+
                                      '<td><button class="btn btn-danger btn-sm deleteLink" id="'+ value.id +'"data-toggle="modal" data-target="#deleteModal_'+ value.id +'"><span><i class="fa fa-times"></i></span></button></td>'+
                                      '</tr>';

                                modalDelete = '<div class="modal fade" id="deleteModal_'+ value.id +'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+"\n"+
                                        '<div class="modal-dialog modal-content" role="document">'+"\n"+
                                        '<div class="modal-content">'+"\n"+
                                        '<div class="modal-header">'+"\n"+
                                        '<h4 class="modal-title w-100">Delete</h4>'+"\n"+
                                        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+"\n"+
                                        '<span aria-hidden="true">&times;</span>'+"\n"+
                                        '</button>'+"\n"+
                                        '</div>'+"\n"+
                                        '<div class="modal-body">'+"\n"+
                                        'Are you sure want to delete ?'+"\n"+
                                        '</div>'+"\n"+
                                        '<div class="modal-footer">'+"\n"+
                                        '<button type="button" class="btn btn-warning badge badge-pill btn-sm" data-dismiss="modal">Cancel</button>'+"\n"+
                                        '<button type="submit" class="btn btn-danger badge badge-pill btn-sm delete" id="'+ value.id +'">Delete</button>'+"\n"+
                                        '</div>'+"\n"+"</div>"+"\n"+"</div>"+"\n"+"</div>"+"\n";
                            }
                            modalUpdate = '<div class="modal fade" id="updateModal_'+ value.id +'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+"\n"+
                                            '<div class="modal-dialog modal-content" role="document">'+"\n"+
                                            '<div class="modal-content">'+"\n"+
                                            '<div class="modal-header">'+"\n"+
                                            '<h4 class="modal-title w-100">Modify</h4>'+"\n"+
                                            '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+"\n"+
                                            '<span aria-hidden="true">&times;</span>'+"\n"+
                                            '</button>'+"\n"+
                                            '</div>'+"\n"+
                                            '<form autocomplete="off" id="modalForm_'+ value.id +'" taskid="'+ value.id +'" method="POST" novalidate="novalidate">'+"\n"+
                                            '<input type="hidden" name="csrfmiddlewaretoken" value="'+ csrf +'">'+"\n"+
                                            '<div class="modal-body">'+"\n"+
                                            '<label>Question*</label>'+"\n"+
                                            '<input type="text" name="question" id="question_'+ value.id +'" class="form-control mb-2" placeholder="Modify task" required="" aria-required="true">'+"\n"+
                                            '<br><label>Question Type</label>'+"\n"+
                                            '<select name="questionType" class="form-control mb-2" id="questionType_'+ value.id +'">'+"\n"+
                                            '<option value="t">Textbox</option><option value="r">Radio</option><option value="c">Checkbox</option><option value="s">Slider</option>'+"\n"+
                                            '</select>'+"\n"+
                                            '</div>'+"\n"+
                                            '<div class="modal-footer">'+"\n"+
                                            '<button type="button" class="btn btn-warning badge badge-pill btn-sm" data-dismiss="modal">Cancel</button>'+"\n"+
                                            '<button type="submit" class="btn btn-success badge badge-pill btn-sm">Update</button>'+"\n"+
                                            '</div>'+"\n"+"</form>"+"\n"+"</div>"+"\n"+"</div>"+"\n"+"</div>"+"\n";
                        }
                        else{
                            //console.log("Default case");
                            res = '<tr>' +
                              '<td>' +  count  + '</td>' +
                              '<td>' + value.question + '</td>' +
                              '<td>' + qType + '</td>' +
                              '</tr>'
                        }
                        $("tbody").append(res);
                        $(".appendModals").append(modalUpdate);
                        $(".appendModals").append(modalDelete);
                        count = count + 1;
                    });
                }
                else{
                    console.log("no data");
                }
            }
        });
    });

    /* Click action for updating the question and its type */
    $(document).delegate(".updateLink", "click", function(){
        var id = $(this).attr('id');
        //alert(id);
        $('form#modalForm_'+id).validate({
            rules: {
                question: "required",
            },
            messages: {
                question: "Please enter the question.",
            },
            submitHandler: function(form) {
                $("#updateModal_"+id+" .close").click();
                var question = $("#question_"+id).val();
                var questionType = $("#questionType_"+id).val();
                $.ajax({
                    url: 'updateQuestion',
                    type: 'post',
                    data: {
                        'id': id,
                        'question': question,
                        'questionType': questionType,
                    },
                    dataType: 'json',
                    success: function(response) {
                        //console.log(response);
                        if(response.result == "success"){
                            if(response.questionType == "t"){
                                qType = "Text box";
                            }
                            else if(response.questionType == "c"){
                                qType = "Check box";
                            }
                            else if(response.questionType == "r"){
                                qType = "Radio button";
                            }
                            else if(response.questionType == "s"){
                                qType = "Slider";
                            }
                            $("#que_"+id).text(response.question);
                            $("#queType_"+id).text(qType);
                            $("#question_"+id).val("");
                            $("#questionType_"+id).val("t");
                        }
                    }
                });
            }
        });
        $("#question_"+id).val("");
        $("#questionType_"+id).val("t");
    });

    /* Click action for deleting the question from question list */
    $(document).delegate(".delete", "click", function(){
        var id = $(this).attr('id');
        //alert(id);
        $("#deleteModal_"+id+" .close").click();
        $.ajax({
            url: 'deleteQuestion',
            type: 'post',
            data: {
                    'id': id,
            },
            dataType: 'json',
            success: function(response) {
                if(response.result == "success")
                {
                    window.location.href = "/home";
                }
            }
        });
   });

   /* Click action for add question to the question list */
   $(document).delegate("#addQuestion", "click", function(){
        $('#addQue').attr('style', 'display: block !important');
        $('form#addqueForm').validate({
            rules: {
                question: "required",
            },
            messages: {
                question: "Please enter the question.",
            },
            submitHandler: function(form) {
                var id = $("#addQuestion").attr('taskid');
                //alert(id);
                var question = $("#question").val();
                var questionType = $("#questionType").val();
                $.ajax({
                    url: 'addQuestion',
                    type: 'post',
                    data: {
                        'qlistId': id,
                        'question': question,
                        'questionType': questionType,
                    },
                    dataType: 'json',
                    success: function(response) {
                        //console.log(response);
                        if(response.result == "success"){
                            window.location.href = "/home";
                        }
                    }
                });
            }
        });
   });

   /* Click action for activating the question list */
   $(document).delegate("#activeButton", "click", function(){
        var id = $(this).attr('taskid');
        //alert(id);
        $.ajax({
                url: 'activate',
                type: 'post',
                data: {
                        'id': id,
                },
                dataType: 'json',
                success: function(response) {
                    console.log(response);
                    if(response.result == "success"){
                        window.location.href = "/home";
                    }
                }
        });
   });

   /* Click action for copying a question list*/
   $(document).delegate(".copy", "click", function(){
        var id = $(this).attr('taskid');
        //alert(id);
        $(".err").text("");
        $('form#copymodalForm_'+id).validate({
            rules: {
                quelistname: "required",
            },
            messages: {
                quelistname: "Please enter the work space name.",
            },
            submitHandler: function(form) {
                var wkName = $("#quelistname_"+id).val();
                //alert(wkName);
                $.ajax({
                    url: 'addQueList',
                    type: 'post',
                    data: {
                        'copyId': id,
                        'wkName': wkName,
                    },
                    dataType: 'json',
                    success: function(response) {
                        //console.log(response);
                        if(response.result == "success"){
                            window.location.href = "/home";
                        }
                        else if(response.result == "exists"){
                            $(".err").text("");
                            var res = '<p class="err" style="color:red;">The workspace name already exists.</p>'
                            $(".modal-body").append(res);
                        }
                    }
                });
            }
        });
        $("#quelistname_"+id).val("");
   });

   /* Click action for reordering the question list*/
   $(document).delegate("#reorderButton", "click", function(){
        var listId = $(this).attr('taskid');
        var questions = [];
        var questionTypes = [];
        var qType = "";
        //alert(listId);
        $("tr:gt(0)").each(function () {
            var this_row = $(this);
            //$.trim(this_row.find('td:eq(1)').html());//td:eq(0) means first td of this row
            qType = $.trim(this_row.find('td:eq(2)').html());
            if(qType == "Check box"){
                qType = 'c';
            }
            else if(qType == "Text box"){
                qType = 't';
            }
            else if(qType == "Radio button"){
                qType = 'r';
            }
            else if(qType == "Slider"){
                qType = 's';
            }

            questions.push($.trim(this_row.find('td:eq(1)').html()));
            questionTypes.push(qType);
        });
        //console.log(questions);
        //console.log(questionTypes);
        $.ajax({
              url: 'reorderList',
              type: 'post',
              data: {
                    'listId': listId,
                    'questions': questions,
                    'qTypes': questionTypes,
              },
              dataType: 'json',
              success: function(response) {
                    //console.log(response);
                    if(response.result == "success"){
                        window.location.href = "/home";
                    }
              }
        });
   });

});