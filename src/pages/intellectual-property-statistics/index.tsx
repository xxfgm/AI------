import React, { useState } from 'react';
import { DatePicker, Radio, Button, Table, Cascader, Flex } from 'antd';
import type { TableProps } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { agencyData } from '../law-enforcement-statistics/agencyData';
import './style.css';

const { RangePicker } = DatePicker;

interface IpData {
    key: string;
    category?: string;
    rowSpan?: number;
    indicatorName: string;
    code: string | number;
    col1: number | string; // 案件总数(件)
    col2: number | string; // 普通程序
    col3: number | string; // 达成调解案件
    col4: number | string; // 案值50万元以上案件
    col5: number | string; // 挂牌督办件
    col6: number | string; // 涉外案件
    col7: number | string; // 案值(万元)
    col8: number | string; // 罚款金额(万元)
    col9: number | string; // 没收金额(万元)
    col10: number | string; // 挽回经济损失(万元)
    col11: number | string; // 挽回涉外企业损失
    col12: number | string; // 移送司法机关案件(件)
}

const mockData: IpData[] = [
    { key: 't1', indicatorName: '甲', code: '乙', col1: 1, col2: 2, col3: 3, col4: 4, col5: 5, col6: 6, col7: 7, col8: 8, col9: 9, col10: 10, col11: 11, col12: 12 },
    { key: 't2', indicatorName: '合计', code: '1', col1: 179, col2: 175, col3: 0, col4: 1, col5: 17, col6: 7, col7: 412.374852, col8: 152.194818, col9: 250.270034, col10: 0, col11: 0, col12: 5 },
    
    // 商标侵权 - 7 rows (Code 2-8)
    { key: '1', category: '商标侵权\n(不包含\n商标违法\n制假情况)', rowSpan: 7, indicatorName: '未经商标注册人的许可，在同一种商品上使用与其注册\n商标相同的商标的（商标法第57条第1项）', code: '2', col1: 11, col2: 11, col3: 0, col4: 0, col5: 1, col6: 0, col7: 4.729904, col8: 4.252, col9: 0.473994, col10: 0, col11: 0, col12: 0 },
    { key: '2', indicatorName: '未经商标注册人的许可，在同一种商品上使用与其注册\n商标近似的商标，或者在类似商品上使用与其注册商标\n相同或者近似的商标，容易导致混淆的（商标法第57\n条第2项）', code: '3', col1: 4, col2: 4, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0.38388, col8: 0.1, col9: 0.28388, col10: 0, col11: 0, col12: 0 },
    { key: '3', indicatorName: '销售侵犯注册商标专用权商品的（商标法第57条第3\n项）', code: '4', col1: 135, col2: 135, col3: 0, col4: 1, col5: 9, col6: 6, col7: 359.891528, col8: 114.848058, col9: 244.84347, col10: 0, col11: 0, col12: 5 },
    { key: '4', indicatorName: '伪造、擅自制造他人注册商标标识或者销售伪造、擅自\n制造的注册商标标识的', code: '5', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '5', indicatorName: '未经商标注册人同意，更换其注册商标并将该更换商标\n的商品又投入市场的（商标法第57条第5项）', code: '6', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '6', indicatorName: '故意为侵犯他人商标专用权行为提供便利条件，帮助他\n人实施侵犯商标专用权行为的（商标法第57条第6项）', code: '7', col1: 11, col2: 11, col3: 0, col4: 0, col5: 7, col6: 0, col7: 22.7562, col8: 22.7562, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '7', indicatorName: '给他人的注册商标专用权造成其他损害的（商标法第\n57条第7项）', code: '8', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },

    // 商标法其他条款 - Code 9-11
    { key: '8', category: '', rowSpan: 0, indicatorName: '按《商标法》第13条请求驰名商标保护的（商标法第13\n条，商标法实施条例第72条）', code: '9', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '9', category: '', rowSpan: 0, indicatorName: '商标注册人申请商标注册前，他人已经在同一种商品或\n者类似商品上先于商标注册人使用与注册商标相同或\n者近似并有一定影响的商标的（商标法第59条第3款）', code: '10', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '10', category: '', rowSpan: 0, indicatorName: '法律、行政法规规定必须使用注册商标的商品，必须申请\n商标注册，未经核准注册的，不得在市场销售的', code: '11', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },

    // 商标使用环节 - 5 rows (Code 12-16)
    { key: '11', category: '商标\n使用\n环节', rowSpan: 5, indicatorName: '将未注册商标冒充注册商标使用的（商标法第52条）', code: '12', col1: 2, col2: 2, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0.55, col8: 0.55, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '12', indicatorName: '使用未注册商标违反《商标法》第十条不得作为商标使\n用的标志的规定的（商标法第52条）', code: '13', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '13', indicatorName: '将“驰名商标”字样用于商品、商品包装或者容器上，\n或者用于广告宣传、展览以及其他商业活动中的（商标法\n第53条）', code: '14', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '14', indicatorName: '在生产、经营活动中，将“驰名商标”字样用于商品、商\n品包装或者容器上或者用于广告宣传、展览以及其他商业\n活动中，用于表明商品的有关产地、商品信息等的', code: '15', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '15', indicatorName: '申请人恶意申请商标注册的（商标法第68条第4款，商\n标局对申请人做出行政处罚需要评估）', code: '16', col1: 2, col2: 2, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0.4, col8: 0.4, col9: 0, col10: 0, col11: 0, col12: 0 },

    // 商标代理 - 4 rows (Code 17-20)
    { key: '16', category: '商标\n代理', rowSpan: 4, indicatorName: '代理机构办理商标代理业务过程中的（商标法第68条第1\n款第2项，规定的是代理机构行为不当引发的）', code: '17', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '17', indicatorName: '办理商标事宜过程中，伪造、变造或者使用伪造、变造的\n法律文书、印章、签名的（商标法第68条第1款第1项）', code: '18', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '18', indicatorName: '以诋毁其他商标代理机构等手段招揽商标代理业务或者\n以其他不正当手段扰乱商标代理市场秩序的（商标法第\n68条第1款第2项）', code: '19', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '19', indicatorName: '进行其他从事商标代理违法活动行为的（商标法相关规\n章增加需要明确）', code: '20', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },

    // 商标印制 - 3 rows (Code 21-23)
    { key: '20', category: '商标\n印制', rowSpan: 3, indicatorName: '商标印制企业承接未提供国家规定准印证件业务的（商\n标代理印制管理办法第38条）', code: '21', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '21', indicatorName: '伪造或者擅自制造他人注册商标标识，伪造或者擅自制造\n他人注册商标标识的（商标法实施条例第五十条第（二\n项）规定）', code: '22', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '22', indicatorName: '侵犯注册商标标识（伪造商标标识，查处印制环节的\n商标标识的（商标法第57条））', code: '23', col1: 1, col2: 1, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0.002, col8: 0.0005, col9: 0.0015, col10: 0, col11: 0, col12: 0 },

    // 地理标志 - 1 row (Code 24)
    { key: '23', category: '地理\n标志', rowSpan: 1, indicatorName: '地理标志（作为注册商标，没有按照中国法律的）管理\n中心依法警告的（对相关使用未按规管理、备案报错、\n征收等超出原有限制范围的）', code: '24', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },

    // 奥林匹克标志保护 - 3 rows (Code 25-27)
    { key: '24', category: '奥林匹克标\n志保护/世界博\n览会标志保护', rowSpan: 3, indicatorName: '侵犯奥林匹克标志保护规定（奥林匹克标志保护规定第\n11条、第24条）', code: '25', col1: 1, col2: 1, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '25', indicatorName: '具体包括：证明商品所有人没有对该商标的使用进行有\n效管理或 者监督；商品使用的奥林匹克标志与奥林匹\n克管理规则的要求；对消费者造成误解的（除修改\n外，还需标明其使用管理办法第71条）', code: '26', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '26', indicatorName: '管理具体规定：证明商品专用权被撤销（具体规定见\n修改后注册规则等办法第22条）', code: '27', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },

    // 特殊标志 - 4 rows (Code 28-31)
    { key: '27', category: '特殊\n标志', rowSpan: 4, indicatorName: '非法使用特殊标志（特殊标志管理条例第16条）', code: '28', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '28', indicatorName: '侵犯特殊标志专有权（特殊标志管理条例第16条）', code: '29', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '29', indicatorName: '侵犯官方标志及专有权（官方标志及专有保护条例第12\n条）', code: '30', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '30', indicatorName: '侵犯亚洲博鳌论坛标志保护权（亚洲博鳌论坛标志保护条\n例第11条）', code: '31', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },

    // 假冒专利 - 5 rows (Code 32-36)
    { key: '31', category: '假冒\n专利', rowSpan: 5, indicatorName: '在未被授予专利权的产品或者其包装上标注专利标识，\n专利权被宣告无效后或者终止后继续在产品或者其包装\n上标注专利标识，或者未经许可在产品或者产品包装上\n标注他人的专利号的（专利法实施细则第84条第1款第1\n项）', code: '32', col1: 1, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '32', indicatorName: '销售伪造专利的产品的（专利法实施细则第84条第1款\n第2项）', code: '33', col1: 1, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '33', indicatorName: '在产品说明书等材料中将未经授予专利权的技术或者设\n计称为专 利技术或者专利设计，将专利申请称为专\n利，或者未经许可使用他人的专利号，使公众将所涉及\n的技术或者设计误认为是专利技术或者专利设计的（专\n利法实施细则第84条第1款第3项）', code: '34', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '34', indicatorName: '伪造或者变造专利证书、专利文件或者专利申请文件的\n（专利法实施细则第84条第1款第4项）', code: '35', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '35', indicatorName: '其他使公众混淆，将未经授予专利权的技术或者设计误\n认为是专利技术或者专利设计的行为（专利法实施细则\n第84条第1款第5项）', code: '36', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },

    // 专利代理 - 3 rows (Code 37-39)
    { key: '36', category: '专利\n代理', rowSpan: 3, indicatorName: '专利代理机构存在违规情形的（专利代理条例第25条）', code: '37', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '37', indicatorName: '专利代理师存在违规情形的（专利代理条例第26条）', code: '38', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '38', indicatorName: '擅自开展专利代理业务的（专利代理条例第27条）', code: '39', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },

    // 其他 - 4 rows (Code 40-43)
    { key: '39', category: '其他', rowSpan: 4, indicatorName: '电子商务平台经营者对平台内经营者实施侵犯知识产权\n行为未依法采取必要措施的', code: '40', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '40', indicatorName: '违反地方性法规、规章，处理地方性法规、规章等自行\n处罚的商标案件', code: '41', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '41', indicatorName: '违反地方性法规、规章，处理地方性法规、规章等自行\n处罚的专利案件', code: '42', col1: 0, col2: 0, col3: 0, col4: 0, col5: 0, col6: 0, col7: 0, col8: 0, col9: 0, col10: 0, col11: 0, col12: 0 },
    { key: '42', indicatorName: '上述项目未能涵盖的其他案件', code: '43', col1: 10, col2: 8, col3: 0, col4: 0, col5: 0, col6: 1, col7: 23.84596, col8: 9.15809, col9: 14.6876, col10: 0, col11: 0, col12: 0 },
];

const Component: React.FC = () => {
    const [reportType, setReportType] = useState('monthly');

    const renderDataCell = (text: any, record: any) => {
        if (['t1', 't2'].includes(record.key)) return text;
        return <span style={{ color: '#1677ff', cursor: 'pointer' }}>{text}</span>;
    };

    const columns: TableProps<IpData>['columns'] = [
        {
            title: '',
            dataIndex: 'category',
            key: 'category',
            align: 'center',
            width: 110,
            fixed: 'left',
            onCell: (record) => {
                if (record.category) {
                    return { rowSpan: record.rowSpan };
                }
                if (['t1', 't2', '8', '9', '10'].includes(record.key)) {
                    return { colSpan: 0 };
                }
                return { rowSpan: 0 };
            },
            render: (text) => <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#111', fontWeight: 500, padding: '4px' }}>{text}</div>
        },
        {
            title: '指标名称',
            dataIndex: 'indicatorName',
            key: 'indicatorName',
            width: 400,
            fixed: 'left',
            onCell: (record) => {
                if (['t1', 't2', '8', '9', '10'].includes(record.key)) {
                    return { colSpan: 2 }; // Span across category and indicatorName
                }
                return {};
            },
            render: (text, record) => {
                const isHeader = ['甲', '合计'].includes(text);
                const isStandalone = ['8', '9', '10'].includes(record.key);

                return (
                    <div style={{
                        paddingLeft: isHeader || isStandalone ? 0 : 16,
                        paddingTop: 8,
                        paddingBottom: 8,
                        fontWeight: isHeader ? 600 : 400,
                        color: isHeader ? '#1f2937' : '#4b5563',
                        textAlign: isHeader ? 'center' : 'left',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6
                    }}>
                        {text}
                    </div>
                );
            }
        },
        {
            title: '代码',
            dataIndex: 'code',
            key: 'code',
            align: 'center',
            width: 60,
        },
        { title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>案件总\n数\n(件)</span>, dataIndex: 'col1', key: 'col1', align: 'center', width: 80, render: renderDataCell },
        { title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>普通程\n序</span>, dataIndex: 'col2', key: 'col2', align: 'center', width: 80, render: renderDataCell },
        { title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>达成调\n解案件</span>, dataIndex: 'col3', key: 'col3', align: 'center', width: 80, render: renderDataCell },
        { title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>案值50\n万元以\n上案件</span>, dataIndex: 'col4', key: 'col4', align: 'center', width: 80, render: renderDataCell },
        { title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>挂牌督\n办件</span>, dataIndex: 'col5', key: 'col5', align: 'center', width: 80, render: renderDataCell },
        { title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>涉外案\n件</span>, dataIndex: 'col6', key: 'col6', align: 'center', width: 80, render: renderDataCell },
        { title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>案值 (万元)</span>, dataIndex: 'col7', key: 'col7', align: 'center', width: 100, render: (t) => t },
        { title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>罚款金额\n(万元)</span>, dataIndex: 'col8', key: 'col8', align: 'center', width: 100, render: (t) => t },
        { title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>没收金额\n(万元)</span>, dataIndex: 'col9', key: 'col9', align: 'center', width: 100, render: (t) => t },
        { title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>挽回经\n济损失\n(万元)</span>, dataIndex: 'col10', key: 'col10', align: 'center', width: 90, render: (t) => t },
        { title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>挽回涉\n外企业\n损失</span>, dataIndex: 'col11', key: 'col11', align: 'center', width: 80, render: (t) => t },
        { title: <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>移送司\n法机关\n案件\n(件)</span>, dataIndex: 'col12', key: 'col12', align: 'center', width: 80, render: renderDataCell },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col p-6">
            <div className="w-full max-w-[1600px] mx-auto">
                {/* 标题 */}
                <div style={{ padding: '24px 0 32px 0', textAlign: 'center' }}>
                    <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937', letterSpacing: '0.05em', margin: 0 }}>知识产权案件统计表 (按行为分类)</h1>
                </div>

                {/* 搜索栏 */}
                <Flex justify="space-between" align="center" style={{ marginBottom: 24, overflowX: 'auto', paddingBottom: 8 }}>
                    <Flex gap={32} align="center" style={{ minWidth: 'max-content' }}>
                        <Flex gap={8} align="center">
                            <span style={{ fontSize: 14, color: '#4b5563', whiteSpace: 'nowrap' }}>办案机构：</span>
                            <Cascader
                                style={{ width: 256 }}
                                placeholder="请选择办案机构"
                                options={agencyData}
                                changeOnSelect
                                allowClear
                                showSearch={{ filter: (inputValue, path) => path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1) }}
                            />
                        </Flex>

                        <Flex gap={8} align="center">
                            <span style={{ fontSize: 14, color: '#4b5563', whiteSpace: 'nowrap' }}>处罚决定日期：</span>
                            <RangePicker style={{ width: 280 }} placeholder={['开始日期', '结束日期']} />
                        </Flex>

                        <Radio.Group onChange={(e) => setReportType(e.target.value)} value={reportType} style={{ marginLeft: 8 }}>
                            <Radio value="monthly">月报</Radio>
                            <Radio value="q1">一季报</Radio>
                            <Radio value="q2">二季报</Radio>
                            <Radio value="q3">三季报</Radio>
                            <Radio value="yearly">年报</Radio>
                        </Radio.Group>
                    </Flex>

                    <Flex gap={8} align="center" style={{ marginLeft: 16, minWidth: 'max-content' }}>
                        <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: '#2563eb' }}>查询</Button>
                        <Button icon={<ExportOutlined />}>导出</Button>
                    </Flex>
                </Flex>

                {/* 表格容器 */}
                <div className="w-full pb-8">
                    <Table
                        dataSource={mockData}
                        columns={columns}
                        pagination={false}
                        bordered
                        size="middle"
                        className="plain-styled-table"
                        scroll={{ x: 1600 }} // 适应列数较多的场景
                    />
                </div>
            </div>
        </div>
    );
};

export default Component;
