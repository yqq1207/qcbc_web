<Tabs defaultActiveKey={tabList[0]} onChange={this.tableChange}>
          {tabList.map((e, index) => {
            return (
              <TabPane tab={e} key={e}>
                <Drag
                  rowKey={e}
                  col={columnsGoodsListLast}
                  data={dataBuffer[index]}
                  onChange={this.searchShopsList}
                  onRow={this.onRowGoodsList}
                  pagination={pagination}
                />
              </TabPane>
              )
            }
          )}
        </Tabs>