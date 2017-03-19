var gameabc_face = gameabc_face||{};
{	
gameabc_face.tag=12;  //定义你的游戏全局内存	
gameabc_face.tag1=123;//定义你的游戏全局内存	
gameabc_face.tag2=123;//定义你的游戏全局内存	
gameabc_face.tag3=123;//定义你的游戏全局内存
	gameabc_face.dfwgao = 1

}

gameabc_face.gamestart=function(gameid)
{
//游戏初始化代码
	gameabc_face.hallLayer = new HallLayer()
	TimeHepler.start();
};

gameabc_face.ani_doend=function(id,sx,count,allend)
{
	logmessage(id+"/"+sx+"/"+count+"/"+allend);
	EngineWrapper.onActionOver(id, sx, count, allend);
	//play_ani(0,2,18,50,200,0,1000,0,0,0,0,6000,1);//主动关闭
};

gameabc_face.box_doend=function(id,sx,timelen)
{
	//play_box 结束事件
	//showmessage("box_doend:"+id+"/"+sx+"/"+timelen);
	logmessage("box_doend:"+id+"/"+sx+"/"+timelen);
	EngineWrapper.onSpeedOver(id, sx, timelen);
};

gameabc_face.onloadurl1=function(recid,rectype,url,error,count,len)
{
  //修改为gameabc_face.onloadurl  则自己处理图片加载进度
  //资源加载完成函数
  //recid:资源id
  //rectype:1 图片 2声音
  //url ：网络地址
  //error:是否加载错误
  //len:资源大小
  //count：加载的个数百分比
	
	logmessage("onload:"+recid+"/"+rectype+"/"+count+"/"+error);

	/*
	if (rectype==0)
	{
		open_load("","1.mp3","");	
		gameabc_face.randombase=0;//使用系统浏览器缓存
	}

	if (count==100)
	{
		game_close_zsmsg("");
		
	} else
	{
		game_open_zsmsg(count+"%"+" 加载中...");
	};
	*/	
};

gameabc_face.chongzhi=function(userid,zt,data)
{
//游戏接口代码		
	
};

gameabc_face.onresize=function(pmw/*屏幕宽*/,pmh/*屏幕宽*/,sjweww/*设计宽*/,sjnewh/*设计宽*/,nweww/*显示宽*/,newh/*显示高*/)
{
	
	//屏幕变化
	// 在此调整 列表控件的宽高和区域 不是整体缩放	
	logmessage("onresize:"+pmw+"/"+pmh+"/"+sjweww+"/"+sjnewh+"/"+nweww+"/"+newh);
};

gameabc_face.gamebegindraw=function(gameid, spid, times, timelong)
{
//更新开始代码

};

gameabc_face.gameenddraw=function(gameid, spid, times, timelong)
{
//更新完成代码
};

gameabc_face.mousedown=function(gameid, spid, downx, downy, no1, no2, no3, no4, no5, no6)
{
//点击代码
	EngineWrapper.onMouseDown(spid, downx, downy);
};

gameabc_face.mousedown_nomove=function(gameid, spid, downx, downy, timelong, no1, no2, no3, no4, no5)
{
//点击代没移动代码

};

gameabc_face.mouseup=function(gameid,  spid_down,  downx,  downy,  spid_up,  upx,  upy,  timelong,  no1,  no2)
{
//点击弹起代码
//可以通过spid_down和spid_up 的比较 来判断是 点击还是 移动
	EngineWrapper.onMouseUp(spid_down, upx, upy);
};

gameabc_face.mousemove=function(gameid, spid, downx, downy, movex,movey ,timelong,offmovex, offmovey, no1)
{
//点击后移动代码
    //set_self(spid,18,offmovex,1,0);
    //set_self(spid,19,offmovey,1,0);
	EngineWrapper.onMouseMove(spid, movex, movey);
};

gameabc_face.gamemydraw=function(gameid, spid, times, timelong, no2, no3, no4, no5, no6, no7)
{
 //每个精灵更新绘画代码

};

gameabc_face.gamemydrawbegin=function(gameid, spid, times, timelong, no2, no3, no4, no5, no6, no7)
{
	//每个精灵更新前绘画代码
	// 动态clip
	var clip = EngineWrapper.seekNodeById(229);
	if(spid == 229) {
		if(clip.getPositionX() <= 310) {
			clip.setRawClip(310 - clip.getPositionX(), 0, clip.getWidth() * 2, clip.getHeight());
		}
	}
	else{// 静态clip
		EngineWrapper.onClip(spid);
	}
};

gameabc_face.ontimer= function(gameid, spid, /* 本次间隔多少次了 */ times, /* 本次间隔多久 */ timelong,/* 开启后运行多少次了 */ alltimes){
/*请在下面输入您的代码
*/
	TimeHepler.dealEvent();
} ;

gameabc_face.tcpconnected=function(tcpid)
{
	/*
	ifast_tcp_open(1,"127.0.0.1:5414");//连接ws tcp
	*/
    logmessage("tcpopen:"+tcpid);
	
};
gameabc_face.tcpmessage=function(tcpid,data)
{	
    logmessage("tcpread:"+data);
	
};

gameabc_face.tcpdisconnected=function(tcpid)
{
    logmessage("tcpclose:"+tcpid);
	
	
};
gameabc_face.tcperror=function(tcpid,data)
{
    logmessage("tcperror:"+tcpid);
	
};

gameabc_face.httpmessage=function(myid,url,data)
{
    /*
    ifast_http(1,"web/test.txt",1);//获取文件 同域
    */
    logmessage("httpread:"+myid+"/"+url+":"+data);
	
};




































