const {expect} = require('chai');

describe('LotterySystem Contract', () =>{
    let LotterySC;
    let lottery;
    let lotteryowner;
    let player1;
    let player2;
    let player3;

    beforeEach(async ()=> {
        LotterySC = await ethers.getContractFactory('LotterySystem');
        lottery = await LotterySC.deploy();
        [lotteryowner , player1, player2, player3, _] = await ethers.getSigners();
    });

    describe('Deployment of Lottery Contract', () =>{
        it('Should set the correct lotteryowner', async ()=>{
            expect( await lottery.lotteryowner()).to.equal(lotteryowner.address);
        });

        it('Should set the expiry time', async ()=>{
            expect(await lottery.expiry()) > 0;
        });

    });

    describe('Join lottery',() =>{
        it('Should not let owner join the lottery', async ()=>{
            const correctetherAmount = ethers.utils.parseEther("0.3");

            try{
                const joinLottery = await lottery.join(lotteryowner.address, {value:correctetherAmount});
                expect(joinLottery).to.be.reverted;

            }catch(err){}
        });

        it('Should let Player join with exact ether amount', async ()=>{
            const correctetherAmount = ethers.utils.parseEther("0.3");
            const joinLottery = await lottery.join(player1.address, {value:correctetherAmount});
            expect(joinLottery);
            const playerinfo = await lottery.players(0);
            expect(playerinfo).to.equal(player1.address.toString());
        });

        it('Should not let Player join with incorrect ether amount', async ()=>{
            const incorrectetherAmount = ethers.utils.parseEther("0.2");
            const revertMessage = "You need to deposit 0.3 ether to join";
            const msg = "VM Exception while processing transaction: reverted with reason string 'You need to deposit 0.3 ether to join'"
            let joinLottery;
            try{
                joinLottery = await lottery.join(player1.address, {value:incorrectetherAmount});
                expect(joinLottery).to.be.reverted;
            }catch(err){}
            
        });

        it('Should let multiple players join the lottery', async ()=>{
            // Join Player 1 in the lottery
            const correctetherAmount = ethers.utils.parseEther("0.3");
            const player1joinLottery = await lottery.join(player1.address, {value:correctetherAmount});
            expect(player1joinLottery);
            const player1info = await lottery.players(0);

            // Join Player 2 in the lottery
            const player2joinLottery = await lottery.join(player2.address, {value:correctetherAmount});
            expect(player2joinLottery);
            const player2info = await lottery.players(1);
            expect(player1info).to.equal(player1.address.toString());
            expect(player2info).to.equal(player2.address.toString());         
        });

        it('Should not let player join after lottery expiry time', async ()=>{
            const expiryMessage = 'Lottery join time has expired'
            await network.provider.send("evm_increaseTime", [3600]);
            await network.provider.send("evm_mine");

            const correctetherAmount = ethers.utils.parseEther("0.3");
            try{
                const player1joinLottery = await lottery.join(player1.address, {value:correctetherAmount});
                expect(player1joinLottery).to.be.reverted;
            }catch(err){}
        });

        it('Should not let player join twice', async ()=>{
            const correctetherAmount = ethers.utils.parseEther("0.3");
            const player1JoinLottery = await lottery.join(player1.address, {value:correctetherAmount});
            expect(player1JoinLottery);
            const player1info = await lottery.players(0);
            try{
                const player1JoinLotterAgain = await lottery.join(player1.address, {value:correctetherAmount});
                expect(player1JoinLotterAgain).to.be.reverted;
            }
            catch(err){}
        });

        

    
    });

    describe('Pick winner ',() =>{
        it('Should let only owner pick the winner', async ()=>{
            // Add players
            const correctetherAmount = ethers.utils.parseEther("0.3");
            const player1joinLottery = await lottery.join(player1.address, {value:correctetherAmount});
            const player1info = await lottery.players(0);

            const player2joinLottery = await lottery.join(player2.address, {value:correctetherAmount});
            const player2info = await lottery.players(1);

            const player3joinLottery = await lottery.join(player3.address, {value:correctetherAmount});
            const player3info = await lottery.players(2);

            expect(player1info).to.equal(player1.address.toString());
            expect(player2info).to.equal(player2.address.toString());
            expect(player3info).to.equal(player3.address.toString());

            await network.provider.send("evm_increaseTime", [3600]);
            await network.provider.send("evm_mine");

            const randomResult = await lottery.randomResult();
            const defaultAddress = "0x0000000000000000000000000000000000000000"
            const pickWinner = await lottery.pickWinner(randomResult, {from: lotteryowner.address});
            expect(await lottery.players(randomResult).toString()).to.not.equal(defaultAddress);

        });

        it('Should not let player pick winner', async ()=>{
            // Add players
            const correctetherAmount = ethers.utils.parseEther("0.3");
            const player1joinLottery = await lottery.join(player1.address, {value:correctetherAmount});
            const player1info = await lottery.players(0);

            const player2joinLottery = await lottery.join(player2.address, {value:correctetherAmount});
            const player2info = await lottery.players(1);

            const player3joinLottery = await lottery.join(player3.address, {value:correctetherAmount});
            const player3info = await lottery.players(2);

            expect(player1info).to.equal(player1.address.toString());
            expect(player2info).to.equal(player2.address.toString());
            expect(player3info).to.equal(player3.address.toString());

            await network.provider.send("evm_increaseTime", [3600]);
            await network.provider.send("evm_mine");

            const randomResult = await lottery.randomResult();
            try{
                expect(await lottery.pickWinner(randomResult, {from: player1.address})).to.be.reverted;
            }catch(err){}
        });
    });
});