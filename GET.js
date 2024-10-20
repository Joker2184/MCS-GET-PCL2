addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const serverIP = 'mc.hypixel.net';  // 替换为你的服务器IP

  try {
    const serverInfo = await getServerInfo(serverIP);
    const xamlContent = generateXAMLTemplate(serverInfo);

    return new Response(xamlContent, {
      headers: { 'content-type': 'application/xml' }
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, {
      headers: { 'content-type': 'text/plain' }
    });
  }
}

// 获取 Minecraft 服务器信息
async function getServerInfo(ip) {
  const apiUrl = `https://api.mcsrvstat.us/2/${ip}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error('无法获取服务器信息');
  }

  const data = await response.json();

  if (!data.online) {
    throw new Error('服务器离线');
  }

  return {
    version: data.version || '未知版本',  // 添加默认值
    onlinePlayers: data.players.online || 0,  // 添加默认值
    maxPlayers: data.players.max || 0,  // 添加默认值
  };
}

// 生成 XAML 模板
function generateXAMLTemplate(serverInfo) {
  return `
<Grid>
    <Grid.ColumnDefinitions>
        <ColumnDefinition Width="0.8*" />
        <ColumnDefinition Width="1*" />
    </Grid.ColumnDefinitions>
    <Grid.RowDefinitions>
        <RowDefinition Height="Auto" />
        <RowDefinition Height="Auto" />
        <RowDefinition Height="Auto" />
        <RowDefinition Height="Auto" />
    </Grid.RowDefinitions>

    <local:MyCard Title="Server DashBoard" Margin="0,0,0,5" Grid.Row="0" Grid.Column="0" Grid.ColumnSpan="2">
        <TextBlock Margin="25,12,20,10" HorizontalAlignment="Right">
            ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })} (UTC+8)
        </TextBlock>
    </local:MyCard>

    <local:MyCard Title="Info" Margin="0,0,2,4" Grid.Row="1" Grid.Column="0">
        <StackPanel Margin="25,40,23,15">
            <TextBlock Margin="0,0,0,4" HorizontalAlignment="Center" TextWrapping="Wrap">
                <Run Text="${serverInfo.onlinePlayers}/${serverInfo.maxPlayers}" FontSize="26"/>
            </TextBlock>
        </StackPanel>
    </local:MyCard>

    <local:MyCard Title="在线人数" Margin="2,0,0,4" Grid.Row="1" Grid.Column="1">
        <StackPanel Margin="25,40,23,15">
            <TextBlock Margin="0,0,0,4" HorizontalAlignment="Center" TextWrapping="Wrap">
                <Run Text="${serverInfo.onlinePlayers}" FontSize="26"/>
                人
            </TextBlock>
        </StackPanel>
    </local:MyCard>

    <local:MyCard Title="新闻" Margin="0,0,2,4" Grid.Row="2" Grid.Column="0">
        <StackPanel Margin="25,40,23,15">
            <TextBlock Margin="0,0,0,4" HorizontalAlignment="Center" TextWrapping="Wrap">
                <Run Text="News" FontSize="26"/>
            </TextBlock>
        </StackPanel>
    </local:MyCard>

    <local:MyCard Title="服务器版本" Margin="2,0,0,4" Grid.Row="2" Grid.Column="1">
        <StackPanel Margin="25,40,23,15">
            <TextBlock Margin="0,0,0,4" HorizontalAlignment="Center" TextWrapping="Wrap">
                <Run Text="${serverInfo.version}" FontSize="26"/>
            </TextBlock>
        </StackPanel>
    </local:MyCard>
    <local:MyCard Title="刷新" Margin="0,0,0,4" Grid.Row="3" Grid.Column="0" Grid.ColumnSpan="2">
    <StackPanel Margin="25,40,23,15">
        <StackPanel Margin="0,0,0,4">
            <TextBlock Margin="0,0,0,4" HorizontalAlignment="Center" TextWrapping="Wrap">
                刷新
            </TextBlock>
        </StackPanel>
        <StackPanel Margin="0,4,0,0" Orientation="Horizontal" HorizontalAlignment="Center">
            <local:MyButton Margin="0,0,4,0" Width="180" Height="35" Text="刷新" EventType="刷新主页" ToolTip="重新加载数据，请勿频繁点击" />
        </StackPanel>
    </StackPanel>
</local:MyCard>
</Grid>
  `;
}
