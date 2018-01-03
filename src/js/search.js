// 返回上一页
$('.cancle').click(()=>{
	window.history.go(-1);
});

// 清除搜索历史子条目
$(".searchHistory").delegate('span','click',function(){
	if($(".searchHistory .item").length===1){
		$(".searchHistory .list-group").remove();
	}else{
		$(this).parent().remove();
	}
	return false;
});
//清除全部搜索历史条目
$(".list-group a:last").click(()=>{
	$(".searchHistory .list-group").remove();
});

//搜索框查询
$('.glyphicon-search').click(()=>{
	let inputVal = $('.top .form-control').val();
	if(inputVal===''){
		alert('查询条件为空!');
		return;
	}else{
		alert($.query(inputVal));
	}
	window.open('http://localhost:3000/page/searchResult.html','_self','',true);
});